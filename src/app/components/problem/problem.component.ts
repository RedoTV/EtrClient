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
export class ProblemComponent implements OnDestroy {
  problemService:ProblemService;
  problems:RequestProblem[] = [];
  problemTableSub:Subscription;
  tableData : TableData = new TableData;
  refreshTable : Subject<boolean> = new Subject<boolean>();

  constructor(problemService: ProblemService) {
    this.tableData.tableColNames = ["ID", "Индекс", "ID контеста", "Название", "Очки", "Рейтинг", "Теги"];
    
    this.problemService = problemService;
    //получаем все задачи
    this.problemTableSub = this.problemService.getAllProblems()
      .subscribe(res => {
        res.forEach(x => this.problems.push(x));
        //заполняем каждую колонку соответствующими данными
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
          
          newTableRow.routerLink = `/codeforces-link/${problem.contest_id}/${problem.index}`;

          //заполняем таблицу получившимися строками
          this.tableData.tableRows.push(newTableRow);
        });

        //перезагружаем таблицу, чтобы все данные отобразились 
        this.refreshTable.next(true);
      });

  }

  ngOnDestroy():void {
    this.problemTableSub.unsubscribe();
  }
}