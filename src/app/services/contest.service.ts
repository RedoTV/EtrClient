import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Contest } from '../models/contest';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  http:HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  public getAllContests():Contest[]
  {
    let contests:Contest[] = []
    this.http.get<Contest>('https://dl.gsu.by/etr/api/contest').subscribe(data => contests.push(data));
    return contests;
  }
}
