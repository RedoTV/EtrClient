import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContestService } from '../../services/contest.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-students-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './students-add.component.html',
  styleUrl: './students-add.component.css'
})

export class StudentsAddComponent {
  userService: UserService;
  handle:string = '';

  constructor(userService: UserService) {
    this.userService = userService;
  }
  
  addUser(){
    this.userService.addUserByHandle(this.handle);
  }
}
