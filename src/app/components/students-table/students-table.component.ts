import { Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.css'
})
export class StudentsTableComponent implements OnInit, OnDestroy{
  userService: UserService;
  width:number = 0;
  users:User[] = [];
  userTableSub:Subscription;

  constructor(userService: UserService) {
    this.userService = userService;
    this.userTableSub = this.userService.getAllUsers()
      .subscribe(res => res.forEach(x => this.users.push(x)));
  }

  ngOnInit() : void {
    this.width = document.body.clientWidth;
  }

  ngOnDestroy():void {
    this.userTableSub.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = document.body.clientWidth;
  }

  sortTable(event : Event) {
    var sortButtons = document.getElementsByClassName("table-sort-button");
    var clickedButton = event.target as Element;
    console.log(clickedButton);
    for (var i = 0; i < sortButtons.length; i++)
    {
      if (sortButtons.item(i)?.id == clickedButton.id)
      {
        if (clickedButton.children.item(0)?.className == "sort-start-higher table-sort-button-user")
        {
          this.assertSortByElementId(-1, clickedButton);
        }
        else
        {
          /*
          clickedButton.children.item(0)!.className = "sort-start-higher table-sort-button-user";
          if (clickedButton.id == "sort-by-ID")
          {
            this.contests.sort((a, b) => b.id - a.id);
            return;
          }
          */
          this.assertSortByElementId(1, clickedButton);
        }
      }
      else if (sortButtons.item(i)!.children.item(0)!.className != "table-sort-button-user")
      {
        sortButtons.item(i)!.children.item(0)!.className = "table-sort-button-user";
      }
    }
  }

  private assertSortByElementId(sortDirection : number, buttonElement : Element) {
    if (sortDirection == 1)
    {
      buttonElement.children.item(0)!.className = "sort-start-higher table-sort-button-user";
    }
    else if (sortDirection == -1)
    {
      buttonElement.children.item(0)!.className = "sort-start-lower table-sort-button-user";
    }
    else
      return;

    if (buttonElement.id == "sort-by-ID")
    {
      this.users.sort((a, b) => (a.id - b.id)*sortDirection);
      return;
    }
    else if (buttonElement.id == "sort-by-first-name")
    {
      this.users.sort((a, b) => {
        if (a.first_name == null && b.first_name == null)
          return 0;
        if (a.first_name == null)
          return -1;
        if (b.first_name == null)
          return 1;
        if (a.first_name > b.first_name)
          return sortDirection;
        else if (a.first_name < b.first_name)
          return sortDirection * -1;
        return 0;
      });
      return;
    }
    else if (buttonElement.id == "sort-by-last-name")
    {
      this.users.sort((a, b) => {
        if (a.last_name == null && b.last_name == null)
          return 0;
        if (a.last_name == null)
          return -1;
        if (b.last_name == null)
          return 1;
        if (a.last_name > b.last_name)
          return sortDirection;
        else if (a.last_name < b.last_name)
          return sortDirection * -1;
        return 0;
      });
      return;
    }
    else if (buttonElement.id == "sort-by-organization")
    {
      this.users.sort((a, b) => {
        if (a.organization == null && b.organization == null)
          return 0;
        if (a.organization == null)
          return -1;
        if (b.organization == null)
          return 1;
        if (a.organization > b.organization)
          return sortDirection;
        else if (a.organization < b.organization)
          return sortDirection * -1;
        return 0;
      });
      return;
    }
    else if (buttonElement.id == "sort-by-city")
    {
      this.users.sort((a, b) => {
        if (a.city == null && b.city == null)
          return 0;
        if (a.city == null)
          return -1;
        if (b.city == null)
          return 1;
        if (a.city > b.city)
          return sortDirection;
        else if (a.city < b.city)
          return sortDirection * -1;
        return 0;
      });
      return;
    }
    else if (buttonElement.id == "sort-by-grade")
    {
      this.users.sort((a, b) => {
        if (a.grade == null && b.grade == null)
          return 0;
        if (a.grade == null)
          return -1;
        if (b.grade == null)
          return 1;
        if (a.grade > b.grade)
          return sortDirection;
        else if (a.grade < b.grade)
          return sortDirection * -1;
        return 0;
      });
      return;
    }
  }
  
  
}