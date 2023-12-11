import { Contest } from './../../models/contest';
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Routes } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ContestService } from '../../services/contest.service';

@Component({
  selector: 'app-contest-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contest-view.component.html',
  styleUrl: './contest-view.component.css'
})

export class ContestViewComponent implements OnDestroy {

  routeSub : Subscription;
  id : number | undefined = 0;
  contestSub : Subscription = new Subscription;
  contestsService : ContestService;
  contest : Contest = new Contest;

  constructor(private route: ActivatedRoute, contestsService : ContestService) {
    this.contestsService = contestsService;
    this.routeSub = this.route.params.subscribe((o : {id? : number}) => this.id = o.id );
    if (this.id !== undefined)
      this.contestSub = contestsService.getContestByID(this.id).subscribe(res => this.contest = res);
  }
  
  ngOnDestroy () {
    this.routeSub.unsubscribe();
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
      this.contest.sort((a, b) => (a.id - b.id)*sortDirection);
      return;
    }
    else if (buttonElement.id == "sort-by-name")
    {
      this.contest.sort((a, b) => {
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
    this.contest.sort((a, b) => 
    {
      if (a.start_datatime == null && b.start_datatime == null)
        return 0;
      if (a.start_datatime == null)
        return -1;
      if (b.start_datatime == null)
        return 1;

      return new Date(
        Number.parseInt(a.start_datatime!.split(' ')[2]), 
        Number.parseInt(a.start_datatime!.split(' ')[1]),
        Number.parseInt(a.start_datatime!.split(' ')[0])
        ).valueOf() * sortDirection * -1 - new Date(
        Number.parseInt(b.start_datatime!.split(' ')[2]), 
        Number.parseInt(b.start_datatime!.split(' ')[1]),
        Number.parseInt(b.start_datatime!.split(' ')[0])
        ).valueOf();
    }
    );
    return;
  }
}
