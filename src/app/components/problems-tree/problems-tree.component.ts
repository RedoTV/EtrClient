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
  problemsSub: Subscription;
  tagsList: Set<string> = new Set<string>;

  constructor(private problemService : ProblemsService)
  {

    this.problemsSub = this.problemService.getAllProblems()
    .subscribe(res => {

      res.forEach(x => this.problems.push(x));

      this.problems.forEach(problem => {
        problem.tags.forEach(tag => {
          this.tagsList.add(tag);
        })
        this.SortByTagsAmount(this.problems);
      });
    });
  }

  OpenProblemsList(id:string) {
    let param = document.getElementById(id)!;
    if (param.style.display == "none") {
      param.style.display = "block"
    } 
    else {
      param.style.display = "none"
    }
  }

  ScrollToNeededTag(tag : string)
  {
    let param = document.getElementById(tag)!;
    if (param.style.display == "none") {
      param.style.display = "block"
    }
    param.style.scrollMarginTop = "35px"
    param.scrollIntoView({behavior: "smooth"});
  }

  FirstToUp(tag : string)
  {
    let newTag = tag[0].toUpperCase();
    for (let i = 1; i < tag.length; i++) 
    {
      newTag += tag[i];
    }
    return newTag;
  }
  
  IsContainTag(problem: Problem, tag: string) {
    return problem.tags.indexOf(tag) != -1;
  }

  SortByTagsAmount(problems: Problem[]) {
    var sortedProblems : Problem[] = problems;
    for (let i = 0; i < sortedProblems.length-1; i++) {
      for (let j = 0; j < sortedProblems.length-1-i; j++) {
        if (sortedProblems[j].tags.length > sortedProblems[j+1].tags.length)
        {
          [sortedProblems[j], sortedProblems[j+1]] = [sortedProblems[j+1], sortedProblems[j]];
        }
      }
    }
    return sortedProblems;
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
    this.problemsSub.unsubscribe();
  }
}

