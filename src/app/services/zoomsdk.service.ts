import { Injectable } from "@angular/core"; 
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment";
@Injectable({
  providedIn: 'root'
})

export class ZoomSDKService {
  api_url = environment.api_url
  constructor(private http: HttpClient) {
    console.log('ZoomSDKService constructor');
  }
  

  getGeneratedSignature(payload: any) {
    return this.http.post(this.api_url + '/generate-jwt-token', payload)
  }
  
}