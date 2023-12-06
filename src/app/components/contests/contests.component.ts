import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contests.component.html',
  styleUrl: './contests.component.css'
})
export class ContestsComponent {
  contestService: ContestService;

  constructor(contestService: ContestService) {
    this.contestService = contestService;
  }

}
