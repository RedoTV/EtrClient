import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Problem } from '../models/request.problem';

@Injectable({
  providedIn: 'root'
})
export class ProblemsService {
  http:HttpClient;
  constructor(http:HttpClient) {
    this.http = http;
  }

  public getAllProblems():Observable<Problem[]>
  {
    return this.http.get('https://dl.gsu.by/etr/api/problem/')
    .pipe(map(r => r[<keyof Object>'problems'] as Object as Problem[]));
  }
}
