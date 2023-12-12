import { Submission } from './../../models/submission';
import { Contest } from './../../models/contest';
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Routes } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { ContestInfo, ContestService } from '../../services/contest.service';
import { ContestUserEntry } from '../../models/contestUserEntry';


class ProblemResults {
  public index : string = "";
  public id : number = 0;
  public totalSubmissions : number = 0;
  public bestVerdict : string = "";
}

class Participant extends ContestUserEntry {
  public problemsResults : ProblemResults[] = [];
  public totalCorrect : number = 0;
  public totalSubmissionsCount = 0;
}


@Component({
  selector: 'app-contest-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contest-view.component.html',
  styleUrl: './contest-view.component.css'
})

export class ContestViewComponent implements OnDestroy {

  routeSub : Subscription;
  id : number | undefined = 0;
  contestSub : Subscription = new Subscription;
  contestsService : ContestService;
  contestInfo : ContestInfo = new ContestInfo;
  participants : Participant[] = [];

  constructor(private route: ActivatedRoute, contestsService : ContestService) {
    this.contestsService = contestsService;
    this.routeSub = this.route.params.subscribe((o : {id? : number}) => this.id = o.id );
    if (this.id !== undefined)
      this.contestSub = contestsService.getContestInfoByID(this.id).subscribe(res => {this.contestInfo = res as ContestInfo; this.fillUserResults(); console.log(this.contestInfo)});
  }
  
  ngOnDestroy () {
    this.routeSub.unsubscribe();
  }

  fillUserResults () {
    this.contestInfo.rows.forEach(userEntry => {
      let participant = new Participant;
      participant.user = userEntry.user;
      participant.submissions = userEntry.submissions;

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
          problemResults.totalSubmissions++;
          participant.problemsResults[problemIndex] = problemResults;
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

      // Use to debug contest table if you need to
      if (participant.user.id == 17) {
        let row = this.participants.find(row => row.user.id === participant.user.id);
        //row?.submissions.forEach(submission => {console.log(submission.verdict), console.log(submission.problem.index)});
        row?.problemsResults.forEach(submission => {console.log(submission.bestVerdict), console.log(submission.index)});
        //console.log(ESubmission);
      }

    });
  }

  sortTable(event : Event) {
    var sortButtons = document.getElementsByClassName("table-sort-button");
    var clickedButton = event.target as Element;
    for (var i = 0; i < sortButtons.length; i++)
    {
      if (sortButtons.item(i)?.id == clickedButton.id)
      {
        if (clickedButton.children.item(0)?.className == "sort-start-higher table-sort-button-content")
        {
          this.assertSortByElementId(-1, clickedButton);
        }
        else
        {
          this.assertSortByElementId(1, clickedButton);
        }
      }
      else if (sortButtons.item(i)!.children.item(0)!.className != "table-sort-button-content")
      {
        sortButtons.item(i)!.children.item(0)!.className = "table-sort-button-content";
      }
    }
  }

  private assertSortByElementId(sortDirection : number, buttonElement : Element) {
    if (sortDirection == 1)
    {
      buttonElement.children.item(0)!.className = "sort-start-higher table-sort-button-content";
    }
    else if (sortDirection == -1)
    {
      buttonElement.children.item(0)!.className = "sort-start-lower table-sort-button-content";
    }
    else
      return;

    if (buttonElement.id == "sort-by-ID")
    {
      this.participants.sort((a, b) => (a.user.id - b.user.id)*sortDirection);
      return;
    }
    else if (buttonElement.id == "sort-by-handle")
    {
      this.participants.sort((a, b) => {
        return a.user.handle.localeCompare(b.user.handle) * sortDirection;
      });
      return;
    }
    else if (buttonElement.id == "sort-by-name")
    {
      this.participants.sort((a, b) => {
        if (a.user.first_name == null && b.user.first_name == null)
          return 0;
        else if (a.user.first_name == null)
          return -1;
        else if (b.user.first_name == null)
          return 1;
        else if (a.user.last_name == null && b.user.last_name == null)
          return 0;
        else if (a.user.last_name == null)
          return -1;
        else if (b.user.last_name == null)
          return 1;

        return (a.user.first_name + a.user.last_name)!.localeCompare(b.user.first_name + b.user.last_name) * sortDirection;
      });
      return;
    }
  }
}
