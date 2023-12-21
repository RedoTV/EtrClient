import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { HttpClient } from '@angular/common/http';
import { Contest } from '../../models/contest';
import { Router, RouterModule } from '@angular/router';
import { TableRow, TableData, TableTemplateComponent } from '../table-template/table-template.component';
import { Subject, map } from 'rxjs';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule, RouterModule, TableTemplateComponent],
  templateUrl: './contests.component.html',
  styleUrl: './contests.component.css'
})
export class ContestsComponent implements OnInit {
  contests:Contest[] = [];
  allContests:Contest[] = [];
  tableData : TableData = new TableData;
  width:number = 0;
  resetTable: Subject<boolean> = new Subject<boolean>();

  constructor(contestService: ContestService) {

    this.tableData.tableColNames = ["ID", "Название", "Дата"];
    this.tableData.directionPresets = [1, 1, -1];

    contestService.getAllContests()
      .subscribe(arr => {
        arr.forEach(contest => this.allContests.push(contest));
        this.allContests.forEach(contest => {

          let tableRow : TableRow = new TableRow;
          tableRow.contents = [contest.id, contest.name, contest.start_datatime];
          tableRow.routerLinks.length = this.tableData.tableColNames.length;
          tableRow.routerLinks.fill(`/contests/${contest.id}`);

          if(contest.start_datatime)
            tableRow.stringinfied = [null, null, contest.start_datatime!.split(' ')[2] + contest.start_datatime?.split(' ')[1] + contest.start_datatime?.split(' ')[0] + contest.start_datatime!.split(' ')[3]];
            this.tableData.tableRows.push(tableRow);
        });
        this.resetTable.next(true);
      });

      this.contests = this.allContests;
  }

  ngOnInit() : void {
    this.width = document.body.clientWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = document.body.clientWidth;
  }

  filterByContests(){
    this.tableData.tableRows = [];

    this.allContests.filter(el => el.type_of_source == 'codeforces_contest').forEach(contest => {
      let tableRow : TableRow = new TableRow;
      tableRow.contents = [contest.id, contest.name, contest.start_datatime];
      tableRow.routerLinks.length = this.tableData.tableColNames.length;
      tableRow.routerLinks.fill(`/contests/${contest.id}`)
      if(contest.start_datatime)
        tableRow.stringinfied = [null, null, contest.start_datatime!.split(' ')[2] + contest.start_datatime?.split(' ')[1] + contest.start_datatime?.split(' ')[0] + contest.start_datatime!.split(' ')[3]];
        this.tableData.tableRows.push(tableRow);
    });
      this.resetTable.next(true);
  }

  filterByGym(){
    this.contests = [];
    this.tableData.tableRows = [];

    this.allContests.filter(el => el.type_of_source == 'codeforces_gym').forEach(contest => {
      let tableRow : TableRow = new TableRow;
      tableRow.contents = [contest.id, contest.name, contest.start_datatime];
      tableRow.routerLinks.length = this.tableData.tableColNames.length;
      tableRow.routerLinks.fill(`/contests/${contest.id}`)
      if(contest.start_datatime)
        tableRow.stringinfied = [null, null, contest.start_datatime!.split(' ')[2] + contest.start_datatime?.split(' ')[1] + contest.start_datatime?.split(' ')[0] + contest.start_datatime!.split(' ')[3]];
        this.tableData.tableRows.push(tableRow);
    });
      this.resetTable.next(true);
  }

  noFilters(){
    this.contests = [];
    this.tableData.tableRows = [];
    this.allContests.forEach(contest => this.contests.push(contest));
        this.contests.forEach(contest => {

          let tableRow : TableRow = new TableRow;
          tableRow.contents = [contest.id, contest.name, contest.start_datatime];
          tableRow.routerLinks.length = this.tableData.tableColNames.length;
          tableRow.routerLinks.fill(`/contests/${contest.id}`);

          if(contest.start_datatime)
            tableRow.stringinfied = [null, null, contest.start_datatime!.split(' ')[2] + contest.start_datatime?.split(' ')[1] + contest.start_datatime?.split(' ')[0] + contest.start_datatime!.split(' ')[3]];
            this.tableData.tableRows.push(tableRow);
        });
        this.resetTable.next(true);
  }
}