import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestContest } from '../models/request.contest';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  http:HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  public getAllContests():Observable<RequestContest>
  {
    return this.http.get<RequestContest>('https://dl.gsu.by/etr/api/contest');
  }
}
