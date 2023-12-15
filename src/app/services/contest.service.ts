import { ContestEntry } from '../models/contestEntry';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Contest } from '../models/contest';

class ContestResponse{
  contests:Contest[] = [];
}

export class ContestInfo {
  contest : Contest = new Contest;
  rows : ContestEntry[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  http:HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  public getAllContestsObsolete():Contest[]
  {
    let contests:Contest[] = []
    this.http.get('https://dl.gsu.by/etr/api/contest/')
      .pipe(map(r => (<ContestResponse>r).contests))
      .subscribe(res => res.forEach(x => contests.push(x)));
    return contests;
  }

  public getAllContests() : Observable<Contest[]>
  {
    return this.http.get('https://dl.gsu.by/etr/api/contest/')
      .pipe(map(data => (<ContestResponse>data).contests));
  }

  public getContestInfoByID(id : number) : Observable<ContestInfo> {
    return this.http.get("https://dl.gsu.by/etr/api/contest/" + id.toString() + "/table") as Observable<ContestInfo>;
  }
}