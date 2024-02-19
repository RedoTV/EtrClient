import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Problem } from '../../models/request.problem';
import { ProblemsService } from '../../services/problems.service';
import { Subject, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-problems-tree',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './problems-tree.component.html',
  styleUrl: './problems-tree.component.css'
})
export class ProblemsTreeComponent implements OnDestroy {
  problems: Problem[] = [];
  problemTableSub: Subscription;
  tags: Set<string> = new Set<string>;

  constructor(private problemService : ProblemsService)
  {

    this.problemTableSub = this.problemService.getAllProblems()
    .subscribe(res => {

      res.forEach(x => this.problems.push(x));
      this.problems.forEach(problem => {
        problem.tags.forEach(tag => {
          let newTag = tag[0].toUpperCase();
          for (let i = 1; i < tag.length; i++) 
          {
            newTag += tag[i];
          }
          this.tags.add(newTag);
        })
        for (let i = 0; i < this.problems.length-1; i++) {
          for (let j = 0; j < this.problems.length-1-i; j++) {
            if (this.problems[j].tags.length > this.problems[j+1].tags.length)
            {
              var problem: Problem;
              problem = this.problems[j];
              this.problems[j] = this.problems[j+1];
              this.problems[j+1] = problem;
            }
          }
        }
      });
    });
  }

  look(id:string) {
    let param = document.getElementById(id)!;
    if (param.style.display == "none") {
      param.style.display = "block"
    } else {
      param.style.display = "none"
    }

  }
  contains(problem: Problem, tag: string) {
    return problem.tags.indexOf(tag) != -1;
  }
  SortByTagsAmount(problems: Problem[]) {
    for (let i = 0; i < this.problems.length-1; i++) {
      for (let j = 0; j < this.problems.length-1-i; j++) {
        if (this.problems[j].tags.length < this.problems[j+1].tags.length)
        {
          var problem: Problem;
          problem = this.problems[j];
          this.problems[j] = this.problems[j+1];
          this.problems[j+1] = problem;
        }
      }
    }
  }
  RouterLink(problem: Problem)
  {
    let externalUrl : string = "";
    if (problem.contest_id !== null && problem.contest_id < 10000) {
      externalUrl = `https://codeforces.com/problemset/problem/${problem.contest_id}/${problem.index}`
    }
    else if (problem.contest_id !== null && problem.contest_id >= 10000) {
      externalUrl = `https://codeforces.com/gym/${problem.contest_id}/problem/${problem.index}`
    }
    return externalUrl;
  }
  ngOnDestroy() {
    this.problemTableSub.unsubscribe();
  }
}

