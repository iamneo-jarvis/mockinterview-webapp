import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';
@Injectable({
  providedIn: 'root'
})

export class CandidateProfileService {
  api_url = environment.api_url
  constructor(private http: HttpClient) {
    console.log('CandidateProfileService constructor');
  }
  getCandidateProfile(payload: any) {
    return this.http.post(this.api_url + '/candidate-profile', payload)
  }
  getResumeDetails(payload: any) {
    return this.http.post(this.api_url + '/resume-details', payload)
  }
  uploadResume(payload: any) {
    return this.http.post(this.api_url + '/resume-parsing', payload)
  }
}