import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Contest } from '../models/contest';
import { Problem } from '../models/request.problem';



class MemberCF {
  handle : string = '';
  name : string | null = null;
}

class ProblemResultsCF {
  points : number = -1;
  penalty : number | null = null;
  rejectedAttemptCount : number = -1;
  type : string = '';
  bestSubmissionTimeSeconds	: number | null = null;
}

class PartyCF {
  contestId	: number = -1;
  members	: MemberCF[] = []
  participantType	: string = ""; // Enum: CONTESTANT, PRACTICE, VIRTUAL, MANAGER, OUT_OF_COMPETITION.
  teamId : number | null = null;
  teamName : string | null = null;
  ghost	: boolean = false;
  room : number | null = null;
  startTimeSeconds : number | null = null;
}

class RanklistRowCF {
  party	: PartyCF = new PartyCF;
  rank : number = -1;
  points : number = -1;
  penalty	: number = -1;
  successfulHackCount	: number = -1;
  unsuccessfulHackCount	: number = -1
  problemResults : ProblemResultsCF[] = [];
  lastSubmissionTimeSeconds	: number | null = null;
}

export class ContestStandingsCF {
  contest : Contest = new Contest;
  problems : Problem[] = [];
  rows : RanklistRowCF[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  constructor (private http : HttpClient){}
  
  public getStandingsOfUsersCF (handles : string[], contestID : number) : Observable<ContestStandingsCF> {
    return this.http.get(`https://codeforces.com/api/contest.standings?contestId=${contestID}&asManager=false&handles=${handles.toLocaleString().replaceAll(',', ';')}&showUnofficial=true`)
    .pipe(map(obj => obj[<keyof Object>'result'] as Object as ContestStandingsCF));
  }
}
