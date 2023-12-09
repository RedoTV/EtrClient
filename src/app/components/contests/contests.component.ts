import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestService } from '../../services/contest.service';
import { HttpClient } from '@angular/common/http';
import { Contest } from '../../models/contest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contests.component.html',
  styleUrl: './contests.component.css'
})
export class ContestsComponent implements OnInit{
  contestService: ContestService;
  contests:Contest[];
  width:number = 0;
  idOrdered:boolean = false;
  dateOrdered:boolean = false;

  constructor(contestService: ContestService, public router: Router) {
    this.contestService = contestService;
    this.contests = this.contestService.getAllContests();
  }

  ngOnInit() : void {
    this.width = document.body.clientWidth;
    this.sortContestsByDate(-1);
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
        if (a.name > b.name)
          return sortDirection;
        else if (a.name < b.name)
          return sortDirection * -1;
        return 0;
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
    this.contests.sort((a, b) => new Date(
      Number.parseInt(a.start_datatime.toString().split(' ')[2]), 
      Number.parseInt(a.start_datatime.toString().split(' ')[1]),
      Number.parseInt(a.start_datatime.toString().split(' ')[0])
      ).valueOf() * sortDirection * -1 - new Date(
      Number.parseInt(b.start_datatime.toString().split(' ')[2]), 
      Number.parseInt(b.start_datatime.toString().split(' ')[1]),
      Number.parseInt(b.start_datatime.toString().split(' ')[0])
      ).valueOf()
    );
    return;
  }
}
