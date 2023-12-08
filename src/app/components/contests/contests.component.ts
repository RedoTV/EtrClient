import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { HttpClient } from '@angular/common/http';
import { Contest } from '../../models/contest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contests.component.html',
  styleUrl: './contests.component.css'
})
export class ContestsComponent implements OnInit{
  contestService: ContestService;
  contests:Contest[];
  width:number = 0;
  idOrdered:boolean = false;
  dateOrdered:boolean = false;

  constructor(contestService: ContestService, public router: Router) {
    this.contestService = contestService;
    this.contests = this.contestService.getAllContests();
  }

  ngOnInit() : void {
    this.width = document.body.clientWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event : Event) : void{
    this.width = document.body.clientWidth;
  }

  clickOnId() : void{
    if(this.idOrdered == false){
      this.contests.sort((a,b) => a.id - b.id);
      this.idOrdered = !this.idOrdered;
    }
    else {
      this.contests.sort((a,b) => b.id - a.id);
      this.idOrdered = !this.idOrdered;
    } 
  }

  clickOnDate() : void{
    if(this.dateOrdered == false){
      this.contests.sort((a, b) => new Date(
          Number.parseInt(a.start_datatime.split(' ')[2]), 
          Number.parseInt(a.start_datatime.split(' ')[1]),
          Number.parseInt(a.start_datatime.split(' ')[0])
        ).valueOf() - new Date(
          Number.parseInt(b.start_datatime.split(' ')[2]), 
          Number.parseInt(b.start_datatime.split(' ')[1]),
          Number.parseInt(b.start_datatime.split(' ')[0])
        ).valueOf()
      );
      this.dateOrdered = !this.dateOrdered;
    }
    else {
      this.contests = this.contests.reverse();
      this.dateOrdered = !this.dateOrdered;
    } 
  }
}
