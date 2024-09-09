import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { WebSocketService } from '../../services/websocker.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
@Component({
  selector: 'app-interview-module',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule],  // Add FormsModule and HttpClientModule to imports
  templateUrl: './interview-module.component.html',
  styleUrls: ['./interview-module.component.less'],
})
export class InterviewModuleComponent {
  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement> | undefined;
  roomId: string = '';
  peerConnection: RTCPeerConnection | undefined;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  recognition: any;  // For speech recognition
  isMicOn: boolean = true;
  isCameraOn: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private websocketService: WebSocketService) {
    // Ensure browser-specific code runs only in the browser
    console.log("platformId-->", platformId)
    console.log("isPlatformBrowser-->", isPlatformBrowser(platformId))
    if (isPlatformBrowser(this.platformId)) {
      console.log('Browser platform detected.');
      this.initSpeechRecognition();
    }else{
      console.log('Non-Browser platform detected.');
    }
  }
  // Check if we're in a browser environment
  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }


  // Initialize speech recognition with feature detection
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US'; // Set language as needed
      
      // Event for receiving transcriptions
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        console.log('Transcription:', finalTranscript || interimTranscript);

        // Send the final transcribed text to the backend using WebSocket
        if (finalTranscript) {
          this.websocketService.sendMessage({
            candidate_id: 'e9c26e9a-adaf-42ef-ae32-35bde7375553',  // Add candidate ID here
            interview_id: 'e9c26e9a-adaf-42ef-ae32-35bde7378883',
            room_id: this.roomId,
            type: 'transcription',
            text: finalTranscript
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error detected: ' + event.error);
      };
    } else {
      console.error('Speech recognition not supported in this browser.');
      // Optionally, notify the user that Speech Recognition is not supported.
    }
  }

  async startCall() {
    this.websocketService.connect(this.roomId);
    console.log('Starting call...');
    // Set up the local stream (video/audio)
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // Check if localVideo is available before using it
    if (this.localVideo?.nativeElement) {
      this.localVideo.nativeElement.srcObject = this.localStream;
    }

    // Start speech recognition if available
    if (this.recognition) {
      this.recognition.start();
    }

    // Create the peer connection
    this.peerConnection = new RTCPeerConnection();

    // Add local stream tracks to the peer connection
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, this.localStream as MediaStream);
    });

    // Set up remote stream when received
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];

      // Check if remoteVideo is available before using it
      if (this.remoteVideo?.nativeElement) {
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;
      }
    };

    // Listen for ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.websocketService.sendMessage({
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming WebSocket messages (signaling)
    this.websocketService.connect(this.roomId);

    // Check if WebSocket connection exists before subscribing
    if (this.websocketService.socket$) {
      this.websocketService.socket$.subscribe(async (message) => {
        if (message.type === 'offer') {
          await this.peerConnection?.setRemoteDescription(
            new RTCSessionDescription(message)
          );
          const answer = await this.peerConnection?.createAnswer();
          await this.peerConnection?.setLocalDescription(answer as RTCSessionDescription);
          this.websocketService.sendMessage({
            type: 'answer',
            sdp: this.peerConnection?.localDescription?.sdp,
          });
        } else if (message.type === 'answer') {
          await this.peerConnection?.setRemoteDescription(
            new RTCSessionDescription(message)
          );
        } else if (message.type === 'candidate') {
          const candidate = message.candidate;
      
          // Check for valid sdpMid and sdpMLineIndex
          if (candidate && candidate.sdpMid && candidate.sdpMLineIndex !== null) {
            await this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            console.error('Invalid ICE candidate:', candidate);
          }
        }else if (message.type === 'transcription') {
          // Process transcription data here
          console.log('Received transcription:', message.text);
        }
      });
    } else {
      console.error('WebSocket connection is not established.');
    }

    // Create an offer if user initiates the call
    const offer = await this.peerConnection?.createOffer();
    await this.peerConnection?.setLocalDescription(offer as RTCSessionDescription);
    this.websocketService.sendMessage({
      type: 'offer',
      sdp: this.peerConnection?.localDescription?.sdp,
    });
  }

  // End the call
  endCall() {
    this.peerConnection?.close();
    this.websocketService.close();
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }

  // Toggle microphone
  toggleMic() {
    if (this.localStream) {
      this.isMicOn = !this.isMicOn;
      this.localStream.getAudioTracks().forEach(track => track.enabled = this.isMicOn);
    }
  }

  // Toggle camera
  toggleCamera() {
    if (this.localStream) {
      this.isCameraOn = !this.isCameraOn;
      this.localStream.getVideoTracks().forEach(track => track.enabled = this.isCameraOn);
    }
  }
}
