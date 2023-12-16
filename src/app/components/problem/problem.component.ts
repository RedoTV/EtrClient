import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestProblem } from '../../models/request.problem';
import { ProblemService } from '../../services/problem.service';
import { Submission } from '../../models/submission';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.css'
})
export class ProblemComponent implements OnInit, OnDestroy {
  problemService:ProblemService;
  problems:RequestProblem[] = [];
  problemTableSub:Subscription;

  constructor(problemService: ProblemService) {
    this.problemService = problemService;
    this.problemTableSub = this.problemService.getAllProblems()
      .subscribe(res => res.forEach(x => this.problems.push(x)));
  }

  ngOnInit(): void {
    
  }
  ngOnDestroy():void {
    this.problemTableSub.unsubscribe();
  }

  forwardToCodeforces(contest_id:number|null, index:string) {
    if (contest_id !== null && contest_id < 10000) {
      window.location.href = `https://codeforces.com/problemset/problem/${contest_id}/${index}`;
    }
    else if (contest_id !== null && contest_id >= 10000) {
      window.location.href = `https://codeforces.com/gym/${contest_id}/problem/${index}`;
    }
  }
}
