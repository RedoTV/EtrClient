import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestProblem } from '../../models/request.problem';
import { ProblemService } from '../../services/problem.service';
import { Subject, Subscription } from 'rxjs';
import { TableData, TableRow, TableTemplateComponent } from '../table-template/table-template.component';
import { Buffer } from 'buffer/';
import { FilterCategory, TablePickFilterComponent } from '../table-pick-filter/table-pick-filter.component';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule, TableTemplateComponent, TablePickFilterComponent],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.css'
})
export class ProblemComponent implements OnDestroy {
  problemService : ProblemService;
  problems : RequestProblem[] = [];
  problemTableSub : Subscription;

  formattedTableData : TableData = new TableData;
  filteredTableData : TableData = new TableData;
  refreshTable : Subject<boolean> = new Subject<boolean>();

  tagsFilterCategories : FilterCategory[] = [];

  constructor(problemService: ProblemService) {
    this.formattedTableData.tableColNames = ["ID", "Индекс", "ID контеста", "Название", "Очки", "Рейтинг", "Теги"];
    this.formattedTableData.colSortableFlag = [true, true, true, true, true, true, false]
    
    this.problemService = problemService;
    //получаем все задачи
    this.problemTableSub = this.problemService.getAllProblems()
      .subscribe(res => {

        res.forEach(x => this.problems.push(x));

        this.tagsFilterCategories.push(new FilterCategory);
        this.tagsFilterCategories.push(new FilterCategory);
        this.tagsFilterCategories[0].name = "Tags";
        this.tagsFilterCategories[1].name = "Index";

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

          
          problem.tags.forEach(tag => {
            this.tagsFilterCategories[0].values.add(tag);
          });
          this.tagsFilterCategories[1].values.add(problem.index);

          let tagsHtml = "";
          if (problem.tags.length != 0)
          {
            const tagHtmlTemplate = '<div style="background-color: #00000008; border: 1.5px solid gray; text-wrap:nowrap; font-size: 18px; line-height: 16px; height: 26px; padding: 4px; margin: 4px; float: left; border-radius: 10px;">'
            tagsHtml = '<div style="max-width: 400px;">\n' + tagHtmlTemplate;
            tagsHtml += problem.tags.join('</div>\n'+ tagHtmlTemplate);
            tagsHtml += '</div>\n</div>';
          }

          newTableRow.htmlString = [
            null,
            null,
            null,
            null,
            null,
            null,
            tagsHtml
          ];

          let externalUrl : string = "";
          if (problem.contest_id !== null && problem.contest_id < 10000) {
            externalUrl = `https://codeforces.com/problemset/problem/${problem.contest_id}/${problem.index}`
          }
          else if (problem.contest_id !== null && problem.contest_id >= 10000) {
            externalUrl = `https://codeforces.com/gym/${problem.contest_id}/problem/${problem.index}`
          }

          newTableRow.queryParams = {href: `${Buffer.from(externalUrl).toString('base64')}`};


          //заполняем таблицу получившимися строками
          this.formattedTableData.tableRows.push(newTableRow);
        });
        
        this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.formattedTableData.tableRows));
        this.filteredTableData.colSortableFlag = JSON.parse(JSON.stringify(this.formattedTableData.colSortableFlag));
        this.filteredTableData.directionPresets = JSON.parse(JSON.stringify(this.formattedTableData.directionPresets));
        this.filteredTableData.tableColNames = JSON.parse(JSON.stringify(this.formattedTableData.tableColNames));
        
        this.filteredTableData = this.filteredTableData;

        console.log(this.filteredTableData == this.filteredTableData);
        console.log(this.formattedTableData);

        //перезагружаем таблицу, чтобы все данные отобразились 
        this.refreshTable.next(true);

      });

  }

  handleTagsFilter (filterEvent : FilterCategory[]) {
    this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.formattedTableData.tableRows));

    filterEvent.forEach(filterCat => {
      console.log(filterCat);
      switch (filterCat.name) {
        case "Tags":
          if (filterCat.values.size != 0) {
            this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.filteredTableData.tableRows.filter(row => {
              if (this.problems[row.contents[0]-1])
              {
                return this.problems[row.contents[0]-1].tags.filter(tag => filterCat.values.has(tag)).length === filterCat.values.size;
              }
              else
                return false;
            })));
          }
        break;
        case "Index":
          if (filterCat.values.size != 0) {
            this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.filteredTableData.tableRows.filter(row => {
              if (this.problems[row.contents[0]-1])
              {
                return filterCat.values.has(this.problems[row.contents[0]-1].index);
              }
              else
                return false;
            })));
          }
        break;
        default:
        break;
      }
    });
    
    this.refreshTable.next(true);
    
  }

  ngOnDestroy() {
    this.problemTableSub.unsubscribe();
  }
}