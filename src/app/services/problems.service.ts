import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RequestProblem } from '../models/request.problem';

class ProblemResponse{
  status:string|null = null;
  problems:RequestProblem[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class ProblemsService {
  http:HttpClient;
  constructor(http:HttpClient) {
    this.http = http;
  }

  public getAllProblems():Observable<RequestProblem[]>
  {
    return this.http.get('https://dl.gsu.by/etr/api/problem/')
    .pipe(map(r => (<ProblemResponse>r).problems))
  }
}
