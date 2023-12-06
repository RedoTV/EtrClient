import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { HttpClient } from '@angular/common/http';
import { Contest } from '../../models/contest';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contests.component.html',
  styleUrl: './contests.component.css'
})
export class ContestsComponent{
  contestService: ContestService;
  contests:Contest[];

  constructor(contestService: ContestService) {
    this.contestService = contestService;
    this.contests = this.contestService.getAllContests();
  }
}
