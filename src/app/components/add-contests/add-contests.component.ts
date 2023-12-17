import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-contests',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-contests.component.html',
  styleUrl: './add-contests.component.css'
})
export class AddContestsComponent {
  contestService: ContestService;
  url:string = '';

  constructor(contestService: ContestService) {
    this.contestService = contestService;
  }

  addContest(){
    this.contestService.addContestByUrl(this.url);
  }
}
