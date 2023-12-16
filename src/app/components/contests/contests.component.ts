import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { HttpClient } from '@angular/common/http';
import { Contest } from '../../models/contest';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contests.component.html',
  styleUrl: './contests.component.css'
})
export class ContestsComponent implements OnInit{
  contestService: ContestService;
  contests:Contest[];
  allContests:Contest[];
  width:number = 0;

  constructor(contestService: ContestService) {
    this.contestService = contestService;
    this.allContests = this.contestService.getAllContests();
    this.contests = this.allContests;
  }

  ngOnInit() : void {
    this.width = document.body.clientWidth;
    this.sortContestsByDate(-1);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = document.body.clientWidth;
  }

  filterByContests(){
    this.contests = this.allContests.filter(el => el.type_of_source == 'codeforces_contest');
  }

  filterByGym(){
    this.contests = this.allContests.filter(el => el.type_of_source == 'codeforces_gym');
  }

  sortTable(event : Event) {
    var sortButtons = document.getElementsByClassName("table-sort-button");
    var clickedButton = event.target as Element;
    for (var i = 0; i < sortButtons.length; i++)
    {
      if (sortButtons.item(i)?.id == clickedButton.id)
      {
        if (clickedButton.children.item(0)?.className == "sort-start-higher table-sort-button-content")
        {
          this.assertSortByElementId(-1, clickedButton);
        }
        else
        {
          /*
          clickedButton.children.item(0)!.className = "sort-start-higher table-sort-button-content";
          if (clickedButton.id == "sort-by-ID")
          {
            this.contests.sort((a, b) => b.id - a.id);
            return;
          }
          */
          this.assertSortByElementId(1, clickedButton);
        }
      }
      else if (sortButtons.item(i)!.children.item(0)!.className != "table-sort-button-content")
      {
        sortButtons.item(i)!.children.item(0)!.className = "table-sort-button-content";
      }
    }
  }

  private assertSortByElementId(sortDirection : number, buttonElement : Element) {
    if (sortDirection == 1)
    {
      buttonElement.children.item(0)!.className = "sort-start-higher table-sort-button-content";
    }
    else if (sortDirection == -1)
    {
      buttonElement.children.item(0)!.className = "sort-start-lower table-sort-button-content";
    }
    else
      return;

    if (buttonElement.id == "sort-by-ID")
    {
      this.contests.sort((a, b) => (a.id - b.id)*sortDirection);
      return;
    }
    else if (buttonElement.id == "sort-by-name")
    {
      this.contests.sort((a, b) => {
        return a.name.localeCompare(b.name) * sortDirection;
      });
      return;
    }
    else if (buttonElement.id == "sort-by-date")
    {
      this.sortContestsByDate(sortDirection);
      return;
    }
  }

  private sortContestsByDate (sortDirection : number) {
    this.contests.sort((a, b) => 
    {
      if (a.start_datatime == null && b.start_datatime == null)
        return 0;
      if (a.start_datatime == null)
        return 1;
      if (b.start_datatime == null)
        return -1;
      
      return new Date(
        Number.parseInt(b.start_datatime!.split(' ')[2]), 
        Number.parseInt(b.start_datatime!.split(' ')[1]),
        Number.parseInt(b.start_datatime!.split(' ')[0])
        ).valueOf() * sortDirection - new Date(
        Number.parseInt(a.start_datatime!.split(' ')[2]), 
        Number.parseInt(a.start_datatime!.split(' ')[1]),
        Number.parseInt(a.start_datatime!.split(' ')[0])
        ).valueOf();
    }
    );
    return;
  }
}
