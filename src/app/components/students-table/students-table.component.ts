import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.css'
})
export class StudentsTableComponent {
  constructor() {
    this.u1.id = 9;
    this.u1.first_name = "Oleg";
    this.u1.last_name = "Olegov";
    this.u1.organization = "DL";
    this.u1.city = "Gomel";
    this.u1.grade = 11;

    this.u2.id = 9;
    this.u2.first_name = "Ivan";
    this.u2.last_name = "Olegov";
    this.u2.organization = "DL";
    this.u2.city = "Gomel";
    this.u2.grade = 11;
  }
  u1:User = new User();
  u2:User = new User();

  users:User[] = [this.u1,this.u2];

  
}