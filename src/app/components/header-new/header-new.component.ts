import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header-new',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header-new.component.html',
  styleUrl: './header-new.component.css'
})
export class HeaderNewComponent {

}
