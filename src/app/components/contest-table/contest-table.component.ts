import { Component } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { Contest } from '../../models/contest';

@Component({
  selector: 'app-contest-table',
  standalone: true,
  imports: [],
  templateUrl: './contest-table.component.html',
  styleUrl: './contest-table.component.css'
})
export class ContestTableComponent {
  contestService : ContestService;
  contests : Contest  [];

  constructor(contestService: ContestService) {
    this.contestService = contestService;
    this.contests = this.contestService.getAllContests();
  }
}
