import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { Contest } from '../models/contest';

class ContestResponse{
  contests:Contest[] = [];
}

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
    this.http.get('http://localhost:5028/Test/getcontests')
      .pipe(map(r => (<ContestResponse>r).contests))
      .subscribe(res => res.forEach(x => contests.push(x)));
    return contests;
  }

  public getContestByID(id : number) : Observable<Contest> {
    return this.http.get("https://dl.gsu.by/etr/api/contest/" + id.toString() + "/table") as Observable<Contest>;
  }
}