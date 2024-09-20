import { Component } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CandidateProfileService } from 'src/app/services/candidate-profile.service';
@Component({
  selector: 'app-resume-parsing',
  standalone: true,
  imports: [FileUploadModule,ButtonModule],
  templateUrl: './resume-parsing.component.html',
  styleUrl: './resume-parsing.component.less'
})
export class ResumeParsingComponent {
  constructor(private cand_profile_service: CandidateProfileService) {}

  onUpload(event: any) {
    console.log(event);
    const formData = new FormData();
    for (let file of event.files) {
      formData.append('file', file);
    }
    let payload = {
      email: 'praveenkumar.m@iamneo.ai',
      file_path: formData,
      job_description: 'Software Engineer'
    }
    console.log(payload);
    this.cand_profile_service.uploadResume(payload).subscribe((res) => {
      console.log(res);
    });
  }
}
