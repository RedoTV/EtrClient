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
  users:User[] = [new User(10, "Oleg", "Olegov", "DL", "Gomel", 11)];
}