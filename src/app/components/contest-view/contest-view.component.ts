import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ContestInfo, ContestService } from '../../services/contest.service';
import { ContestEntry } from '../../models/contestEntry';
import { TableTemplateNewComponent, TableData } from '../table-template-new/table-template-new.component';
import { StandingsService } from '../../services/standings.service';


class ProblemResults {
  public index : string = "";
  public id : number = 0;
  public totalSubmissions : number = 0;
  public bestVerdict : string = ""; 
  public points : number = 0;
}

class Participant extends ContestEntry {
  public problemsResults : ProblemResults[] = [];
  public totalCorrect : number = 0;
  public totalSubmissionsCount = 0;
  public points = 0;
}

@Component({
  selector: 'app-contest-view',
  standalone: true,
  imports: [CommonModule, RouterLink, TableTemplateNewComponent],
  templateUrl: './contest-view.component.html',
  styleUrl: './contest-view.component.css'
})

export class ContestViewComponent implements OnDestroy {
  routeSub : Subscription;
  id : number | undefined = 0;
  contestSub : Subscription = new Subscription;
  contestInfo : ContestInfo = new ContestInfo;
  participants : Participant[] = [];
  participantsFiltered : Participant[] = [];
  tableData : TableData = new TableData;
  backupDone : boolean = false;

  tableUpdateSubject = new Subject<boolean>;

  noPointsData : boolean = false;
  
  showPoints : boolean = false;

  private readonly possibleCombinations = [
    "FAILED", "OK", "PARTIAL", "COMPILATION_ERROR",
    "RUNTIME_ERROR", "WRONG_ANSWER", "PRESENTATION_ERROR", 
    "TIME_LIMIT_EXCEEDED", "MEMORY_LIMIT_EXCEEDED", "IDLENESS_LIMIT_EXCEEDED", 
    "SECURITY_VIOLATED", "CRASHED", "INPUT_PREPARATION_CRASHED",
    "CHALLENGED", "SKIPPED", "TESTING", "REJECTED"
  ];

  constructor(private route: ActivatedRoute, contestsService : ContestService, private standingsService : StandingsService) {

    this.tableData.tableColNames = ['#', 'Фамилия, Имя', 'Город', 'Организация', 'Класс',  'Баллы', 'Верно'];
    this.tableData.colSortableFlag = [false, true, true, true, true, true, true];
    this.tableData.directionPresets = [0, 0, 0, 0, 0, 1];

    

    this.routeSub = this.route.params.subscribe((o : {id? : number}) => this.id = o.id );
    if (this.id !== undefined)
      this.contestSub = contestsService.getContestInfoByID(this.id).subscribe(res => {
        
        this.contestInfo = res as ContestInfo;
        this.evaluateParticipantsResults();

        this.tableData.colSortableFlag.length = this.tableData.tableColNames.length + this.contestInfo.contest.problems.length;
        this.tableData.colSortableFlag.fill(true, 1, this.tableData.tableColNames.length - 2);
        this.tableData.colSortableFlag.fill(false, this.tableData.tableColNames.length - 1, this.contestInfo.contest.problems.length - 1);

        this.contestInfo.contest.problems.forEach(problem => this.tableData.tableColNames.push(problem.index));
      });
  }
  
  ngOnDestroy () {
    this.routeSub.unsubscribe();
  }

  filterByParticipantType(type : string) {
    switch(type) {
      case "ANY":
        this.filterParticipants([]);
        break;
      case "CONTESTANT":
        this.filterParticipants(['PRACTICE', 'VIRTUAL', 'MANAGER', 'OUT_OF_COMPETITION']);
        break;
      case "VIRTUAL":
        this.filterParticipants(['PRACTICE', 'CONTESTANT', 'MANAGER', 'OUT_OF_COMPETITION']);
        break;
      case "OTHER":
        this.filterParticipants(['VIRTUAL', 'CONTESTANT', 'MANAGER']);
        break;
      default:
        break;
    }
  }

  filterParticipants(participantTypeFilter : string[]) {
    this.participantsFiltered = [];
    let filterIndex = 0;
    this.participants.forEach((participant, index) => {
      // Just outright exclude participant if none of the submissions are by non-filtered participant type
      if (participant.submissions.every(submission => participantTypeFilter.includes(submission.type_of_member)))
        return;
      else {
        // We partly add this participant to a participantsFiltered and recalculate points.
        this.participantsFiltered.push(new Participant);
        this.participantsFiltered[filterIndex].totalCorrect = 0;
        this.participantsFiltered[filterIndex].totalSubmissionsCount = 0;
        //this.participantsFiltered[filterIndex].problemsResults = JSON.parse(JSON.stringify(participant.problemsResults));
        this.participantsFiltered[filterIndex].submissions = JSON.parse(JSON.stringify(participant.submissions));

        this.participantsFiltered[filterIndex].user = participant.user;
        this.participantsFiltered[filterIndex].team = participant.team;

        this.participantsFiltered[filterIndex] = this.participantProblemResults(this.participantsFiltered[filterIndex], participantTypeFilter);
        filterIndex++;
      }
    });

    this.tableUpdateSubject.next(true);

  }

  evaluateParticipantsResults () {
    // May stuck in loop of always requesting standings from CF if got no data from it...
    // Until we are rate-limited, or this boolean will stop it...
    if (this.backupDone)
      return;
    this.contestInfo.rows.forEach(entry => {
      let participant : Participant = new Participant;

      if(entry.user !== null && entry.user !== undefined)
      {
        participant.user = entry.user;
        participant.team = null;
      }
      else if (entry.team !== null && entry.team !== undefined) {
        participant.team = entry.team;
        participant.user = null;
      }
      else {
        return;
      }
      participant.submissions = entry.submissions;

      participant = this.participantProblemResults(participant, []);

      participant.problemsResults.sort((a, b) => a.index.localeCompare(b.index));
      this.participants.push(participant);
    });

    this.participantsFiltered = this.participants;

    this.noPointsData = this.participants.every(participant => participant.points == 0);

    // If no points data - we modify table a bit and try query CF for points
    if (this.noPointsData) {
      this.tableData.colSortableFlag.length = this.tableData.tableColNames.length + this.contestInfo.contest.problems.length;
      this.tableData.colSortableFlag.fill(true, 1, this.tableData.tableColNames.length - 2);
      this.tableData.colSortableFlag.fill(false, this.tableData.tableColNames.length - 1, this.contestInfo.contest.problems.length - 1);
      this.tableUpdateSubject.next(true);
      
      // Preparing user handles for query.
      let userHandles : string[] = [];
      this.contestInfo.rows.forEach(row => {
        if (row.user)
          userHandles.push(row.user.handle);
        else if (row.team)
          row.team.users.map(user => user.handle).forEach(handle => userHandles.push(handle));
      });

      // Recieve points from CF as a backup.
      this.standingsService.getStandingsOfUsersCF(userHandles, this.contestInfo.contest.id).subscribe(standings => {
        //console.log(standings);

        standings.rows.forEach(row => {
          // Checks if PartyCF is actually a team
          if (row.party.teamId != null) {
            // It's sooo bad ;_;
            // But I don't see any other way how I can compare
            // teams from our API with teams from CF...
            let teamIndex = this.contestInfo.rows.filter(rows => rows.team != null).findIndex(
              participant => participant.team!.users.map(user => user.handle).sort() 
              === 
              row.party.members.map(member => member.handle).sort()
            ); 

            row.problemResults.forEach((problemRes, i) => {
              let submissionMatchIdx = this.contestInfo.rows[teamIndex].submissions.findIndex(submission => submission.problem.index === standings.problems[i].index && submission.type_of_member === row.party.participantType && submission.verdict === 'OK');
              
              if (submissionMatchIdx >= 0)
                this.participants[teamIndex].submissions[submissionMatchIdx].points = problemRes.points;

            });
          }
          else {
            // Else, we seek for a user and set it's according submissions points.
            // We record points into contestInfo.rows.submissions because they are used by
            // fillProblemResults to, well, fill participants' problems' results.
            let userIndex = this.contestInfo.rows.filter(rows => rows.user != null).findIndex(
              participant => participant.user!.handle === row.party.members[0].handle
            ); 

            row.problemResults.forEach((problemRes, i) => {
              let submissionMatchIdx = this.contestInfo.rows[userIndex].submissions.findIndex(submission => submission.problem.index === standings.problems[i].index && submission.type_of_member === row.party.participantType && submission.verdict === 'OK');
              
              if (submissionMatchIdx >= 0)
                this.contestInfo.rows[userIndex].submissions[submissionMatchIdx].points = problemRes.points;
              
            });
          }
          
        });
        
        // Reseting participants and refilling them again with new data
        this.participants = [];
        this.evaluateParticipantsResults();
        // Check for noPoints data again...
        this.noPointsData = this.participants.every(participant => participant.points === 0 || participant.points === 1);
        
        // May stuck in loop of always requesting standings from CF if got no data from it...
        // Until we are rate-limited, or this boolean will stop it...
        this.backupDone = true;

        this.tableUpdateSubject.next(true);
      });

      
    }
  }

  participantProblemResults (participant : Participant, participantTypeFilter : string[]) : Participant {
    participant.submissions.forEach(submission => {
      let submittedProblem = this.contestInfo.contest.problems.find(problem => problem.id === submission.problem.id);
      let problemResults = participant.problemsResults.find(problem => problem.index === submittedProblem!.index);

      if (participantTypeFilter.includes(submission.type_of_member))
        return;

      if (problemResults === undefined)
      {
        problemResults = new ProblemResults;
        problemResults.bestVerdict = submission.verdict;
        problemResults.id = submittedProblem!.id;
        problemResults.index = submittedProblem!.index;
        problemResults.points = submission.points ? submission.points : 0;

        problemResults.totalSubmissions++;

        // if (submittedProblem!.points)
        //   problemResults.points = submittedProblem!.points;
        // else
        //   problemResults.points = 0;
        participant.problemsResults.push(problemResults);
      }
      else
      {
        if (submission.verdict === "OK") {
          problemResults.bestVerdict = submission.verdict;
        }
        else {
          problemResults.bestVerdict = submission.verdict;
        }

        if (submission.points && problemResults.points < submission.points)
        {
          problemResults.points = submission.points;
        }

        problemResults.totalSubmissions++;
      }
    });

    participant.problemsResults.forEach(problemResults => {
      if (problemResults.bestVerdict === "OK")
      {
        participant.totalCorrect++;
      }
    });

    if (participant.problemsResults.length < this.contestInfo.contest.problems.length)
    {
      this.contestInfo.contest.problems.forEach(contestProblem => {
        if (participant.problemsResults.find(problemResult => problemResult.index === contestProblem.index) === undefined)
        {
          let problemResults = new ProblemResults;
          problemResults.bestVerdict = "NO_SUBMISSIONS";
          problemResults.id = contestProblem.id;
          problemResults.index = contestProblem.index;
          problemResults.totalSubmissions++;
          participant.problemsResults.push(problemResults);
        }
      });
    }

    participant.points = participant.problemsResults.map(res => res.points).reduce((x, y) => x+y);

    return participant;
  }
  
  showPointsSwitch(state : boolean) {
    this.showPoints = state;
  }

}