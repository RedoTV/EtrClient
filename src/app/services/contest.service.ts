import { ContestEntry } from '../models/contestEntry';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
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

  public getAllContests():Observable<Contest[]>
  {
    return this.http.get<ContestResponse>('https://dl.gsu.by/etr/api/contest/')
      .pipe(map(r => r.contests))
  }

  public getContestInfoByID(id : number) : Observable<ContestInfo> {
    return this.http.get("https://dl.gsu.by/etr/api/contest/" + id.toString() + "/table") as Observable<ContestInfo>;
  }

  public getContests(){
    return this.http.get<ContestResponse>('https://dl.gsu.by/etr/api/contest/')
      .pipe(map(r => r.contests.filter(el => el.type_of_source == 'codeforces_contest')))
  }
  public getTrainings(){
    return this.http.get<ContestResponse>('https://dl.gsu.by/etr/api/contest/')
      .pipe(map(r => r.contests.filter(el => el.type_of_source == 'codeforces_gym')))
  }
}