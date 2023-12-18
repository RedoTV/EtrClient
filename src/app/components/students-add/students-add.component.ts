import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContestService } from '../../services/contest.service';

@Component({
  selector: 'app-students-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './students-add.component.html',
  styleUrl: './students-add.component.css'
})
export class StudentsAddComponent {
  contestService: ContestService;
  handle:string = '';

  constructor(contestService: ContestService) {
    this.contestService = contestService;
  }
  
  addUser(){
    this.contestService.addUserByHandle(this.handle);
  }
}
