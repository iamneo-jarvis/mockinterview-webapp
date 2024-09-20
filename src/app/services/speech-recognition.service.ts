import { Injectable } from '@angular/core';

interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;

  constructor() {
    // Check for SpeechRecognition (for modern browsers) or webkitSpeechRecognition (for older browsers like Chrome)
    const { webkitSpeechRecognition, SpeechRecognition }: Window = window as any;

    // Use webkitSpeechRecognition if available, otherwise fall back to SpeechRecognition
    if (webkitSpeechRecognition || SpeechRecognition) {
      this.recognition = new (webkitSpeechRecognition || SpeechRecognition)();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = true; // Continuous recognition
      this.recognition.interimResults = true; // Get interim results (real-time transcription)
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }

  /**
   * Start speech recognition and handle the result via a callback.
   * @param onResult Callback that handles the final transcript of recognized speech.
   */
  startRecognition(onResult: (transcript: string) => void) {
    if (!this.recognition) {
      console.error('Speech recognition not initialized.');
      return;
    }

    this.recognition.start();

    // Handle the result of speech recognition
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          onResult(transcript); // Return the final transcript via the callback
        } else {
          interimTranscript += transcript; // You could use this for interim results
        }
      }
    };

    // Handle any errors that occur during recognition
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  /**
   * Stop the speech recognition process.
   */
  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
