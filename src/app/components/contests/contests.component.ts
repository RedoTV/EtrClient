import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { Contest } from '../../models/contest';
import { RouterModule } from '@angular/router';
import { TableRow, TableData, TableTemplateComponent } from '../table-template/table-template.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule, RouterModule, TableTemplateComponent],
  templateUrl: './contests.component.html',
  styleUrl: './contests.component.css'
})
export class ContestsComponent implements OnInit {
  contests : Contest[] = [];
  tableData : TableData = new TableData;
  width : number = 0;
  refreshTable : Subject<boolean> = new Subject<boolean>();

  constructor(contestService: ContestService) {

    this.tableData.tableColNames = ["ID", "Название", "Дата"];
    this.tableData.directionPresets = [1, 1, -1];

    contestService.getAllContests()
      .subscribe(arr => {
        arr.forEach(contest => this.contests.push(contest));

        this.contests.forEach(contest => {
          this.addContestToTable(contest);
        });

        this.refreshTable.next(true);
      });
  }


  
  ngOnInit() : void {
    this.width = document.body.clientWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = document.body.clientWidth;
  }

  //обобщенный фильтр для разных типов контеста
  filterBySourceType (sourceType : string) {
    this.tableData.tableRows = [];
    this.contests.forEach(contest => {
      if (contest.type_of_source == sourceType || sourceType == "any") {
        this.addContestToTable(contest);
      }
    });
    this.refreshTable.next(true);
  }

  //добавляем строку в таблицу с контестами
  private addContestToTable (contest : Contest) {
    let tableRow : TableRow = new TableRow;
    //заполнение строки
    tableRow.contents = [contest.id, contest.name, contest.start_datatime];
    //заполнение полей для переадресации
    tableRow.routerLinks.length = this.tableData.tableColNames.length;
    tableRow.routerLinks.fill(`/contests/${contest.id}`)
    //фильтрование наполнения даты, понятного обычному человеку
    let start_datatime_sorted = null;
    if(contest.start_datatime)
      start_datatime_sorted = contest.start_datatime!.split(' ')[2] + 
      contest.start_datatime?.split(' ')[1] + 
      contest.start_datatime?.split(' ')[0] + contest.start_datatime!.split(' ')[3];

      tableRow.stringinfied = [null, null, start_datatime_sorted];
      this.tableData.tableRows.push(tableRow);
  }

}