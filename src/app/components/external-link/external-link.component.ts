import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Buffer } from 'buffer/';

export class ExternalUrl {
  url : (string | null) = null;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-link.component.html',
  styleUrl: './external-link.component.css'
})

export class ExternalLinkComponent {
  externalUrl : string | null = null;
  
  constructor (private route : ActivatedRoute) {
    this.externalUrl = Buffer.from(route.snapshot.queryParams['externalUrl'], 'base64').toString('binary');
    if (this.externalUrl != null)
    {
      console.log(this.externalUrl);
      window.location.href = (this.externalUrl);
    }
    
  }
}
