import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Problem } from '../../models/request.problem';
import { ProblemsService } from '../../services/problems.service';
import { Subject, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TableTemplateNewComponent, TableData, TableRow } from '../table-template-new/table-template-new.component';

@Component({
  selector: 'app-problems-tree',
  standalone: true,
  imports: [CommonModule, RouterModule, TableTemplateNewComponent],
  templateUrl: './problems-tree.component.html',
  styleUrl: './problems-tree.component.css'
})
export class ProblemsTreeComponent implements OnDestroy {
  problems: Problem[] = [];
  problemTableSub: Subscription; 
  tags: Set<string> = new Set<string>;

  formattedTableData : TableData = new TableData;
  filteredTableData : TableData = new TableData;
  refreshTable : Subject<boolean> = new Subject<boolean>();

  constructor(private problemService : ProblemsService)
  {
    this.formattedTableData.tableColNames = ["ID", "Название", "Теги"];
    this.formattedTableData.colSortableFlag = [true, true, false];
    this.formattedTableData.ignoreSortingFlags = [false];

    this.problemTableSub = this.problemService.getAllProblems()
    .subscribe(res => {

      res.forEach(x => this.problems.push(x));
      this.problems.forEach(problem => {
        let newTableRow = new TableRow;
        newTableRow.contents = [
          problem.id,
          problem.name,
          problem.tags
        ];

        problem.tags.forEach(tag => {
          let newTag = tag[0].toUpperCase();
          for (let i = 1; i < tag.length; i++) 
          {
            newTag += tag[i];
          }
          this.tags.add(newTag);
        })


        let tagsHtml = "";
          if (problem.tags.length != 0)
          {
            const tagHtmlTemplate = '<div style="background-color: #00000008; border: 1.5px solid gray; text-wrap:nowrap; font-size: 18px; line-height: 16px; height: 26px; padding: 4px; margin: 4px; float: left; border-radius: 10px;">'
            tagsHtml = '<div style="max-width: 400px;">\n' + tagHtmlTemplate;
            tagsHtml += problem.tags.join('</div>\n'+ tagHtmlTemplate);
            tagsHtml += '</div>\n</div>';
          }

          let externalUrl : string = "";
          if (problem.contest_id !== null && problem.contest_id < 10000) {
            externalUrl = `https://codeforces.com/problemset/problem/${problem.contest_id}/${problem.index}`
          }
          else if (problem.contest_id !== null && problem.contest_id >= 10000) {
            externalUrl = `https://codeforces.com/gym/${problem.contest_id}/problem/${problem.index}`
          }

          newTableRow.routerLink = externalUrl;
          this.formattedTableData.tableRows.push(newTableRow);
      });

      this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.formattedTableData.tableRows));
      this.filteredTableData.colSortableFlag = JSON.parse(JSON.stringify(this.formattedTableData.colSortableFlag));
      this.filteredTableData.directionPresets = JSON.parse(JSON.stringify(this.formattedTableData.directionPresets));
      this.filteredTableData.tableColNames = JSON.parse(JSON.stringify(this.formattedTableData.tableColNames));
      this.filteredTableData = this.filteredTableData;

      //перезагружаем таблицу, чтобы все данные отобразились 
      this.refreshTable.next(true);
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

  contains(problemTags: TableRow, tag: string) {
    return problemTags.contents[2].indexOf(tag) != -1;
  }

  ngOnDestroy() {
    this.problemTableSub.unsubscribe();
  }
}

