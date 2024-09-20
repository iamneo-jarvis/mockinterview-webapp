import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { InterviewModuleComponent } from './core/interview-module/interview-module.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DOCUMENT } from '@angular/common';
// import { ZoomSDKService } from '../app/services/zoomsdk.service'
import uitoolkit from '@zoom/videosdk-ui-toolkit'
import { zoom_jwt_payload } from './models/types'
import  ZoomVideo  from '@zoom/videosdk'
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ResumeParsingComponent } from './core/interview-module/resume-parsing/resume-parsing.component';
import { NavbarInterviewComponent } from './navbar-interview/navbar-interview.component';
import { ZoomSDKService } from './services/zoomsdk.service';
// import { ZoomComponent } from './zoom-module/zoom.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatTabsModule, MatIconModule, MatButtonModule, FormsModule, NavbarInterviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'mockinterview-webapp';
  // sessionContainer: any;
  // inSession: boolean = false;
  // client: any;
  // messageText: string = ''; // For handling chat input
  // transcription: string = ''; // Placeholder for transcription data
  // isMicOn: boolean = true; // State for mic toggle
  // isCameraOn: boolean = true; // State for camera toggle

  // config = {
  //   videoSDKJWT: '',
  //   sessionName: 'iamneo',
  //   userName: 'Angular',
  //   sessionPasscode: '123',
  //   features: ['preview', 'video', 'audio', 'settings', 'users', 'chat', 'share'],
  //   options: { init: {}, audio: {}, video: {}, share: {} },
  //   virtualBackground: {
  //      allowVirtualBackground: true,
  //      allowVirtualBackgroundUpload: true,
  //      virtualBackgrounds: ['https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop']
  //   }
  // };
  // role = 1

  // constructor(@Inject(DOCUMENT) private document: Document, private zoom: ZoomSDKService) {
  //   // this.client = ZoomVideo.createClient(); // Initialize the Zoom Video SDK client
  // }

  // ngOnInit() {
  //   this.initZoomSession();
  // }

  // initZoomSession() {
  //   this.client.init('en-US', 'CDN'); // Initialize the Zoom client with the language and resource mode
  // }

  // getVideoSDKJWT() {
  //   this.sessionContainer = this.document.getElementById('sessionContainer')

  //   this.inSession = true;
  //   const payload : zoom_jwt_payload = {
  //     "interview_id": "e9c26e9a-hjkl-34rt-ae32-35bde7375553",
  //     "candidate_id": "e9c26e9a-adaf-42ef-ae32-35bde7375553",
  //     "candidate_name": "PraveenKumar"
  //   }
  //   this.zoom.getGeneratedSignature(payload).subscribe((data: any) => {
  //     if(data.signature) {
  //       console.log(data.signature)
  //       this.config.videoSDKJWT = data.signature;
  //       this.config.sessionName = data.sessionName;
  //       this.config.userName = data.userName;
  //       this.config.sessionPasscode = data.sessionPasscode;
  //       this.joinSession();
  //     } else {
  //       console.log(data);
  //     }
  //   });
  // }

  // joinSession() {
  //   uitoolkit.joinSession(this.sessionContainer, this.config)

  //   // Handle session joined event
  //   uitoolkit.onSessionJoined(() => {
  //     console.log('Session joined successfully');
  //   });

  //   // Handle session ended event
  //   uitoolkit.onSessionClosed(() => {
  //       console.log('Session ended');
  //       this.inSession = false;
  //       uitoolkit.closeSession(this.sessionContainer);
  //   });
  // }
  
}
