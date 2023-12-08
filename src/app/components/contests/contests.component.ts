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

  constructor(contestService: ContestService, public router: Router) {
    this.contestService = contestService;
    this.contests = this.contestService.getAllContests();
  }

  ngOnInit(): void {
    this.width = document.body.clientWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event : Event) {
    console.log((event.target as Window).innerWidth);
    this.ngOnInit();
  }
  
  reloadCurrentRoute() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([this.router.url]);
    });
  }

}
