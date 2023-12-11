import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.css'
})
export class StudentsTableComponent {
  users:User[];
  constructor(userService: UserService) {
    this.users = userService.getAllUsers();
  }
  
}