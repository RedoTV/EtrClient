import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-codeforces-link',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './codeforces-link.component.html',
  styleUrl: './codeforces-link.component.css'
})
export class CodeforcesLinkComponent {
  contest_id : number | null = null;
  index : string | null = null;
  previousPageUrl: string | null = null;
  link : string | null = null;

  constructor (private route : ActivatedRoute) {
    this.contest_id = Number(route.snapshot.paramMap.get("contest_id")); 
    this.index = route.snapshot.paramMap.get("index");
    this.previousPageUrl = route.snapshot.paramMap.get("previousPage");
    this.forwardToCodeforces();
  }

  forwardToCodeforces() {
    //проверка: это контест или тренировка
    if (this.contest_id !== null && this.contest_id < 10000) {
      this.link = `https://codeforces.com/problemset/problem/${this.contest_id}/${this.index}`;
      window.open(this.link, '_blank');
    }
    else if (this.contest_id !== null && this.contest_id >= 10000) {
      this.link = `https://codeforces.com/gym/${this.contest_id}/problem/${this.index}`;
      window.open(this.link, '_blank');
    }
    //переадресация на предыдущую страницу
    if(this.previousPageUrl !== null){
      window.location.href = this.previousPageUrl;
    }
  }
}