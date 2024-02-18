import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Problem } from '../../models/request.problem';
import { ProblemsService } from '../../services/problems.service';
import { Subject, Subscription, map } from 'rxjs';
import { FilterCategory, TablePickFilterComponent } from '../table-pick-filter/table-pick-filter.component';
import { TableTemplateNewComponent, TableData, TableRow } from '../table-template-new/table-template-new.component';
import { Params, RouterLink, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule, TablePickFilterComponent, TableTemplateNewComponent, RouterLink],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.css'
})

export class ProblemsComponent implements OnDestroy {
  problems : Problem[] = [];
  problemTableSub : Subscription;

  formattedTableData : TableData = new TableData;
  filteredTableData : TableData = new TableData;
  refreshTable : Subject<boolean> = new Subject<boolean>();

  tagsFilterCategories : FilterCategory[] = [];

  constructor(private problemsService: ProblemsService, ) {
    this.formattedTableData.tableColNames = ["ID", "Индекс", "ID контеста", "Название", "Очки", "Рейтинг", "Теги"];
    this.formattedTableData.colSortableFlag = [true, true, true, true, true, true, false];
    
    //получаем все задачи
    this.problemTableSub = this.problemsService.getAllProblems()
      .subscribe(res => {

        res.forEach(x => this.problems.push(x));

        this.tagsFilterCategories.push(new FilterCategory);
        this.tagsFilterCategories.push(new FilterCategory);
        this.tagsFilterCategories.push(new FilterCategory);

        this.tagsFilterCategories[0].name = "Теги";
        this.tagsFilterCategories[1].name = "Индекс";
        this.tagsFilterCategories[2].name = "Поиск";

        this.tagsFilterCategories[0].type = "picker";
        this.tagsFilterCategories[1].type = "picker";
        this.tagsFilterCategories[2].type = "search";

        

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

          let externalUrl : string = "";
          if (problem.contest_id !== null && problem.contest_id < 10000) {
            externalUrl = `https://codeforces.com/problemset/problem/${problem.contest_id}/${problem.index}`
          }
          else if (problem.contest_id !== null && problem.contest_id >= 10000) {
            externalUrl = `https://codeforces.com/gym/${problem.contest_id}/problem/${problem.index}`
          }

          newTableRow.routerLink = externalUrl;

          //заполняем таблицу получившимися строками
          this.formattedTableData.tableRows.push(newTableRow);
        });
        
        this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.formattedTableData.tableRows));
        this.filteredTableData.colSortableFlag = JSON.parse(JSON.stringify(this.formattedTableData.colSortableFlag));
        this.filteredTableData.directionPresets = JSON.parse(JSON.stringify(this.formattedTableData.directionPresets));
        this.filteredTableData.tableColNames = JSON.parse(JSON.stringify(this.formattedTableData.tableColNames));

        //перезагружаем таблицу, чтобы все данные отобразились 
        this.refreshTable.next(true);

      });

  }

  handleTagsFilter (filterEvent : FilterCategory[]) {
    this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.formattedTableData.tableRows));

    filterEvent.forEach(filterCat => {
      switch (filterCat.name) {
        case "Теги":
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
        case "Индекс":
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
        case "Поиск":
          if (filterCat.values.has(''))
            break;
          if (filterCat.values.size == 0) 
            break;

          this.filteredTableData.tableRows = JSON.parse(JSON.stringify(this.filteredTableData.tableRows.filter(row => {
            let problem = this.problems[row.contents[0]-1]
            let match = false;
            if (problem)
            {
              for(let value of filterCat.values) {
                if(value.startsWith('"') && value.endsWith('"')) {
                  value = value.substring(1, value.length - 1);
                  match = value == problem.name ||
                          value == problem.index ||
                          value == problem.id.toString() || 
                          value == (problem.contest_id != null ? problem.contest_id.toString() : '');
                  if (match == false)
                    return false; 
                }
                else if (match == false) {
                  match = this.fuzzyMatch(value, problem.name + problem.index + problem.id.toString() + (problem.contest_id != null ? problem.contest_id.toString() : ''));
                }
              }
              return match;
            }
            else
              return false;
          })));
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

  // https://stackoverflow.com/questions/23305000/javascript-fuzzy-search-that-makes-sense
  // i'm no good at regex...
  escapeRegExp(str: string) : string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  fuzzyMatch(pattern : string, str : string) : boolean {
    pattern = '.*' + pattern.split('').map(l => `${this.escapeRegExp(l)}.*`).join('');
    const re = new RegExp(pattern);
    return re.test(str);
  }
  
}