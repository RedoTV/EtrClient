import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ContestInfo, ContestService } from '../../services/contest.service';
import { ContestEntry } from '../../models/contestEntry';
import { TableTemplateNewComponent, TableData, TableRow } from '../table-template-new/table-template-new.component';


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
  tableData : TableData = new TableData;

  tableUpdateSubject = new Subject<boolean>;

  noPointsData : boolean = false;

  private readonly possibleCombinations = [
    "FAILED", "OK", "PARTIAL", "COMPILATION_ERROR",
    "RUNTIME_ERROR", "WRONG_ANSWER", "PRESENTATION_ERROR", 
    "TIME_LIMIT_EXCEEDED", "MEMORY_LIMIT_EXCEEDED", "IDLENESS_LIMIT_EXCEEDED", 
    "SECURITY_VIOLATED", "CRASHED", "INPUT_PREPARATION_CRASHED",
    "CHALLENGED", "SKIPPED", "TESTING", "REJECTED"
  ];

  constructor(private route: ActivatedRoute, contestsService : ContestService) {

    this.tableData.tableColNames = ['#', 'Фамилия, Имя', 'Город', 'Организация', 'Класс',  'Баллы', 'Верно'];
    this.tableData.colSortableFlag = [false, true, true, true, true, true, true];
    this.tableData.directionPresets = [0, 0, 0, 0, 0, 1];

    this.routeSub = this.route.params.subscribe((o : {id? : number}) => this.id = o.id );
    if (this.id !== undefined)
      this.contestSub = contestsService.getContestInfoByID(this.id).subscribe(res => {
        
        this.contestInfo = res as ContestInfo;
        this.fillProblemResults([]);

        console.log(this.contestInfo);
        
        this.contestInfo.contest.problems.forEach(problem => this.tableData.tableColNames.push(problem.index));
      });
  }
  
  ngOnDestroy () {
    this.routeSub.unsubscribe();
  }

  filterByParticipantType(type : string) {
    this.participants = [];
    switch(type) {
      case "ANY":
        this.fillProblemResults([]);
        break;
      case "CONTESTANT":
        this.fillProblemResults(['PRACTICE', 'VIRTUAL', 'MANAGER', 'OUT_OF_COMPETITION']);
        break;
      case "VIRTUAL":
        this.fillProblemResults(['PRACTICE', 'CONTESTANT', 'MANAGER', 'OUT_OF_COMPETITION']);
        break;
      case "OTHER":
        this.fillProblemResults(['VIRTUAL', 'CONTESTANT', 'MANAGER']);
        break;
      default:
        break;
    }
  }

  fillProblemResults (participantTypeFilter : string[]) {
    this.contestInfo.rows.forEach(entry => {
      let participant : Participant = new Participant;

      if (entry.submissions.every(submission => participantTypeFilter.includes(submission.type_of_member)))
        return;

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

      participant.submissions.forEach(submission => {
        let submittedProblem = this.contestInfo.contest.problems.find(problem => problem.id === submission.problem.id);
        let problemIndex = 0;
        let problemResults = participant.problemsResults.find((problem, index) => {problemIndex = index; return problem.index === submittedProblem!.index});

        if (participantTypeFilter.includes(submission.type_of_member))
          return;

        if (problemResults === undefined)
        {
          problemResults = new ProblemResults;
          problemResults.bestVerdict = submission.verdict;
          problemResults.id = submittedProblem!.id;
          problemResults.index = submittedProblem!.index;
          problemResults.totalSubmissions++;

          if (submittedProblem!.points)
            problemResults.points = submittedProblem!.points;
          else
            problemResults.points = 0;

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

          if (submittedProblem!.points && problemResults.points < submittedProblem!.points)
          {
            problemResults.points = submittedProblem!.points;
          }

          problemResults.totalSubmissions++;
          participant.problemsResults[problemIndex] = problemResults;
        }

      });

      participant.problemsResults.forEach(problemResult => {
        if (problemResult.bestVerdict === "OK")
        {
          //let addedPoints = this.contestInfo.contest.problems.find(problem => problemResult.id === problem.id)!.points; 
          //participant.points += addedPoints ? addedPoints : 0;
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

      participant.problemsResults.sort((a, b) => a.index.localeCompare(b.index));
      this.participants.push(participant);
    });

    this.noPointsData = this.participants.every(participant => participant.points == 0);

    if (this.noPointsData) {
      this.tableData.colSortableFlag.length = this.tableData.tableColNames.length + this.contestInfo.contest.problems.length;
      this.tableData.colSortableFlag.fill(true, 1, this.tableData.tableColNames.length - 2);
      this.tableData.colSortableFlag.fill(false, this.tableData.tableColNames.length - 1, this.contestInfo.contest.problems.length - 1);
      this.tableUpdateSubject.next(true);
    }
  }
}