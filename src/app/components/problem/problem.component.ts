import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestProblem } from '../../models/request.problem';
import { ProblemService } from '../../services/problem.service';
import { Submission } from '../../models/submission';
import { Subject, Subscription } from 'rxjs';
import { TableData, TableRow, TableTemplateComponent } from '../table-template/table-template.component';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule, TableTemplateComponent],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.css'
})
export class ProblemComponent implements OnInit, OnDestroy {
  problemService:ProblemService;
  problems:RequestProblem[] = [];
  problemTableSub:Subscription;
  tableData : TableData = new TableData;
  refreshTable : Subject<boolean> = new Subject<boolean>();

  constructor(problemService: ProblemService) {
    this.tableData.tableColNames = ["ID", "Индекс", "ID контеста", "Название", "Очки", "Рейтинг", "Теги"];
    
    this.problemService = problemService;
    this.problemTableSub = this.problemService.getAllProblems()
      .subscribe(res => {
        res.forEach(x => this.problems.push(x));

        this.problems.forEach(problem => {
          let newTableRow = new TableRow;
          newTableRow.contents = [
            problem.id,
            problem.index,
            problem.contest_id,
            problem.name,
            problem.points,
            problem.rating,
            problem.tags
          ];
          
          this.tableData.tableColNames.forEach(colName => {
            newTableRow.routerLinks.push(`/codeforces-link/${problem.contest_id}/${problem.index}/${window.location.pathname}`);
          });

          this.tableData.tableRows.push(newTableRow);
        });

        this.refreshTable.next(true);
      });

  }

  ngOnInit(): void {
    
  }
  ngOnDestroy():void {
    this.problemTableSub.unsubscribe();
  }
}