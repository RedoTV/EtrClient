import { Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Problem } from '../../models/request.problem';
import { ProblemsService } from '../../services/problems.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-problems-tree',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './problems-tree.component.html',
  styleUrl: './problems-tree.component.css'
})

export class ProblemsTreeComponent implements OnDestroy{
  problems: Problem[] = [];
  problemsSortedByTags: Problem[][] = [];
  tagToProblems: Map<string, Problem[]> = new Map<string, Problem[]>;
  problemsSub: Subscription;
  tagsList: Set<string> = new Set<string>;
  hardBtnIsClicked: boolean;
  rating:number;

  constructor(private problemService : ProblemsService)
  {
    this.hardBtnIsClicked = false;
    this.problemsSub = new Subscription();
    this.rating = 0;
  }

  ActivateFirstHardBtn()
  {
    this.hardBtnIsClicked = true;
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
    for (let i = 0; i < this.tagsList.size; i++) {
      for (let j = 0; j < this.problems.length; j++) {
        if (this.problems[j].tags.indexOf(Array.from(this.tagsList)[i])) {
          this.problemsSortedByTags[i][j] = this.problems[j];
        }
      }
    }
    // this.problemsSub.unsubscribe();
  }

  FindWithRating(rating: number)
  {
    this.hardBtnIsClicked = true;
    this.problemService.getProblemsWithRating(rating)
    .subscribe(res => {

      res.forEach(x => this.problems.push(x));

      this.problems.forEach(problem => {
        problem.tags.forEach(tag => {
          this.tagsList.add(tag);
        })
        
      });
      
      this.tagsList.forEach(tag => {
        this.tagToProblems.set(tag, this.SortByTagsAmount(this.problems.filter(
            problem => problem.tags.find(probTag => probTag == tag))
        ));
        
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
    let tagBox = document.getElementById(tag);
    if(!tagBox)
      return;
    
    if (tagBox.style.display == "none") {
      tagBox.style.display = "block"
    }
    tagBox.style.scrollMarginTop = "50px"
    tagBox.scrollIntoView({behavior: "smooth", block: "start"});
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

