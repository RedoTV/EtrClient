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
  routeSub : Subscription;
  contest_id : number | null = null;
  index : string | null = null;

  constructor (private route : ActivatedRoute) {
    this.routeSub = route.paramMap.subscribe(obs => { this.contest_id = Number(obs.get("contest_id")); this.index = obs.get("index"); console.log(obs)})
    this.forwardToCodeforces();
  }


  forwardToCodeforces() {
    if (this.contest_id !== null && this.contest_id < 10000) {
      window.open(`https://codeforces.com/problemset/problem/${this.contest_id}/${this.index}`, '_blank');
    }
    else if (this.contest_id !== null && this.contest_id >= 10000) {
      window.open(`https://codeforces.com/gym/${this.contest_id}/problem/${this.index}`, '_blank');
    }
  }
}
