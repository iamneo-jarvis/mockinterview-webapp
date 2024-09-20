import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ZoomSDKService } from '../services/zoomsdk.service';
import { zoom_jwt_payload } from '../models/types';
import { SpeechRecognitionService } from '../services/speech-recognition.service';
import { WebSocketService } from '../services/websocket.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DOCUMENT } from '@angular/common';
import ZoomVideo from '@zoom/videosdk';
import uitoolkit from '@zoom/videosdk-ui-toolkit';
declare interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

declare interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

declare interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

declare interface SpeechRecognitionErrorEvent extends Event {
  readonly error: 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
  readonly message: string;
}
@Component({
  selector: 'app-zoom-module',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './zoom.component.html',
  styleUrl: './zoom.component.less'
})
export class ZoomComponent implements AfterViewInit {

  roomId: number = 0;  // Zoom meeting ID
  sessionContainer: any;
  inSession: boolean = false;
  client: any;  // Zoom client instance
  messageText: string = ''; // For handling chat input
  transcription: string = ''; // Placeholder for transcription data
  isMicOn: boolean = true; // State for mic toggle
  isCameraOn: boolean = true; // State for camera toggle
  config = {
    videoSDKJWT: '',
    sessionName: 'iamneo',
    userName: 'Angular',
    sessionPasscode: '123',
    features: ['preview', 'video', 'audio', 'settings', 'users', 'chat', 'share'],
    options: { init: {}, audio: {}, video: {}, share: {} },
    virtualBackground: {
      allowVirtualBackground: true,
      allowVirtualBackgroundUpload: true,
      virtualBackgrounds: ['https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop']
    }
  };
  role = 1;
  recognition: any;  // Speech recognition instance

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private zoom: ZoomSDKService,
    private speechService: SpeechRecognitionService,
    private websocketService: WebSocketService,  // Use WebSocket for sending transcriptions
  ) {}

  ngAfterViewInit() {
    // Initialize the Zoom Video SDK client
    this.client = ZoomVideo.createClient();
    this.sessionContainer = this.document.getElementById('sessionContainer');
    if (this.sessionContainer) {
      this.initZoomSession();
    } else {
      console.error("Session container not found in the DOM");
    }
  }

  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.websocketService.closeConnection();
  }

  initZoomSession() {
    // Check if client is initialized before calling init
    if (this.client) {
      this.client.init('en-US', 'CDN'); // Initialize the Zoom client with the language and resource mode
    } else {
      console.error("Zoom client is not initialized");
    }
  }

  getVideoSDKJWT() {
    this.sessionContainer = document.getElementById('sessionContainer');
    this.inSession = true;
    const payload: zoom_jwt_payload = {
      "interview_id": "e9c26e9a-hjkl-34rt-ae32-35bde7375553",
      "candidate_id": "e9c26e9a-adaf-42ef-ae32-35bde7375553",
      "candidate_name": "PraveenKumar"
    }
    this.zoom.getGeneratedSignature(payload).subscribe((data: any) => {
      if (data.VIDEO_SDK_JWT) {
        this.config.videoSDKJWT = data.VIDEO_SDK_JWT;
        this.joinSession();
        console.log('Session joined successfully');
      } else {
        console.log(data);
      }
    });
  }

  joinSession() {
    uitoolkit.joinSession(this.sessionContainer, this.config);
    this.startTranscription(this.config.videoSDKJWT); // Start live transcription
    uitoolkit.onSessionClosed(this.sessionClosed);
    this.websocketService.connect(this.roomId);  // Connect to the WebSocket server
  }

  // End the Zoom meeting
  endCall() {
    if (this.client) {
      if (this.inSession) {
        const localStream = this.client.getMediaStream();
        if (localStream) {
          localStream.stopVideo(); // Stop the video stream
          console.log('Video track stopped');
        }

        this.client.leave().then(() => {
          console.log('Left the session successfully');
          uitoolkit.closeSession(this.sessionContainer);
          this.inSession = false;
        }).catch((error: any) => {
          console.error('Error leaving the session:', error);
        });
      } else {
        console.log('Session is already closed or inactive.');
      }
    } else {
      console.error('Zoom client is not initialized');
    }
  }

  // Start live transcription
  startTranscription(jwt_token: string) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    console.log("jwt_token-->", jwt_token);


    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;  // Keep the recognition running even between pauses
    this.recognition.interimResults = true;  // Get interim results before the final transcription

    // Start speech recognition
    this.recognition.start();

    if (SpeechRecognition) {
      // Handle recognition result
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscription = '';
        console.log('Speech recognition event:', event, event.results);
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          // if (event.results[i].isFinal) {
            this.transcription += transcript + ' ';
            console.log('Final transcription:', transcript);
            // Send final transcription to the backend
            this.websocketService.sendTranscription({ transcription: transcript, type: 'transcription' });
          // } else {
            interimTranscription += transcript;
          // }
        }
        // Optionally send interim transcription to backend if needed
        console.log('Interim transcription:', interimTranscription);
      };
  
      // Handle errors
      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected. Please speak again.');
        }
      };
  
      // Handle end of speech recognition and restart it
      this.recognition.onend = () => {
        console.log('Speech recognition ended. Restarting...');
        this.recognition.start();  // Restart recognition automatically after it ends
      };
  
      console.log('Speech recognition started.');
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }
  
  // Stop transcription
  stopTranscription() {
    if (this.recognition) {
      this.recognition.stop();
      console.log('Transcription stopped.');
    }
  }

  sessionClosed = () => {
    console.log('session closed');
    uitoolkit.closeSession(this.sessionContainer);
    this.stopTranscription();
    this.inSession = false;
  }

}
