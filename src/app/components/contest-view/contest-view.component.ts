import { Submission } from './../../models/submission';
import { Contest } from './../../models/contest';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Routes } from '@angular/router';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { ContestInfo, ContestService } from '../../services/contest.service';
import { ContestEntry } from '../../models/contestEntry';
import { TableData, TableRow, TableTemplateComponent } from './../table-template/table-template.component';


class ProblemResults {
  public index : string = "";
  public id : number = 0;
  public totalSubmissions : number = 0;
  public bestVerdict : string = ""; 
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
  imports: [CommonModule, RouterLink, TableTemplateComponent],
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
  refreshTable: Subject<boolean> = new Subject<boolean>();

  private readonly possibleCombinations = [
    "FAILED", "OK", "PARTIAL", "COMPILATION_ERROR",
    "RUNTIME_ERROR", "WRONG_ANSWER", "PRESENTATION_ERROR", 
    "TIME_LIMIT_EXCEEDED", "MEMORY_LIMIT_EXCEEDED", "IDLENESS_LIMIT_EXCEEDED", 
    "SECURITY_VIOLATED", "CRASHED", "INPUT_PREPARATION_CRASHED",
    "CHALLENGED", "SKIPPED", "TESTING", "REJECTED"
  ];

  constructor(private route: ActivatedRoute, contestsService : ContestService) {

    this.tableData.tableColNames = ["ID", "Фамилия, Имя", "Баллы", "Верно"];

    this.routeSub = this.route.params.subscribe((o : {id? : number}) => this.id = o.id );
    if (this.id !== undefined)
      this.contestSub = contestsService.getContestInfoByID(this.id).subscribe(res => {
        
        this.contestInfo = res as ContestInfo;
        this.fillUserResults();
        
        this.contestInfo.contest.problems.forEach(problem => this.tableData.tableColNames.push(problem.index));

        this.participants.forEach((participant, index) => {
          let tableRow : TableRow = new TableRow;

          let formattedResults : string[] = [];

          participant.problemsResults.forEach(result => {
            let formattedResult : string = "";

            if (result.bestVerdict == "OK")
              formattedResult += `<div style="color: green;"> +`;
            else if (result.bestVerdict !== "NO_SUBMISSIONS")
              formattedResult += `<div style="color: red;"> -`;
            else
              formattedResult += `<div style="color: red;">`;

            if (result.totalSubmissions > 1)
              formattedResult += result.totalSubmissions;
            
            formattedResult += `</div>`

            formattedResults.push(formattedResult);
          });

          tableRow.contents = [
            index,
            participant.user !== null ? `${participant.user?.last_name} ${participant.user?.first_name}` : participant.team,
            participant.points,
            participant.totalCorrect,
          ];
          tableRow.routerLinks = [null, `/students/${participant.user?.handle}`, null, null];
          tableRow.htmlString = [null, null, null, null];
          formattedResults.forEach(result => {
            tableRow.htmlString.push(result);
          });

          this.tableData.tableRows.push(tableRow);
        });

        console.log(this.tableData);

        this.refreshTable.next(true);

      });
  }
  
  ngOnDestroy () {
    this.routeSub.unsubscribe();
  }

  fillUserResults () {
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

      participant.submissions.forEach(submission => {
        let submittedProblem = this.contestInfo.contest.problems.find(problem => problem.id === submission.problem.id);
        let problemIndex = 0;
        let problemResults = participant.problemsResults.find((problem, index) => {problemIndex = index; return problem.index === submittedProblem!.index});
        if (problemResults === undefined)
        {
          problemResults = new ProblemResults;
          problemResults.bestVerdict = submission.verdict;
          problemResults.id = submittedProblem!.id;
          problemResults.index = submittedProblem!.index;
          problemResults.totalSubmissions++;
          participant.problemsResults.push(problemResults);
        }
        else
        {
          /*
          if (problemResults.bestVerdict === "RUNTIME_ERROR") {
            problemResults.bestVerdict = submission.verdict;
          }
          else if (submission.verdict !== "RUNTIME_ERROR")
          {
            if (problemResults.bestVerdict === "COMPILATION_ERROR")
            {
              problemResults.bestVerdict = submission.verdict;
            }
            else if (submission.verdict !== "COMPILATION_ERROR")
            {
              if (problemResults.bestVerdict === "WRONG_ANSWER") {
                problemResults.bestVerdict = submission.verdict;
              }
              else if (submission.verdict !== "WRONG_ANSWER")
              {
                if (problemResults.bestVerdict === "MEMORY_LIMIT_EXCEEDED") {
                  problemResults.bestVerdict = submission.verdict;
                }
                else if (submission.verdict !== "MEMORY_LIMIT_EXCEEDED")
                {
                  if (problemResults.bestVerdict === "TIME_LIMIT_EXCEEDED") {
                    problemResults.bestVerdict = submission.verdict;
                  }
                  else if (submission.verdict !== "TIME_LIMIT_EXCEEDED")
                  {
                    if (problemResults.bestVerdict === "CHALLENGED") {
                      problemResults.bestVerdict = submission.verdict;
                    }
                  }
                }
              }
            }
          }
          */

          if (submission.verdict === "OK") {
            problemResults.bestVerdict = submission.verdict;
          }
          else {
            problemResults.bestVerdict = submission.verdict;
          }

          problemResults.totalSubmissions++;
          participant.problemsResults[problemIndex] = problemResults;
        }

      });

      participant.problemsResults.forEach(problemResult => {
        if (problemResult.bestVerdict === "OK")
        {
          let addedPoints = this.contestInfo.contest.problems.find(problem => problemResult.id === problem.id)!.points; 
          participant.points += addedPoints ? addedPoints : 0;
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
  }
}