import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentInfo, UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-view.component.html',
  styleUrl: './student-view.component.css'
})
export class StudentViewComponent{
  userHandle: string;
  user : User = new User;

  constructor(private route: ActivatedRoute, private userService : UserService) {
    this.userHandle = route.snapshot.params["userHandle"];
    userService.getUserByHandle(this.userHandle).subscribe(obs => {this.user = obs[0]; console.log(this.user);});

  }



}
