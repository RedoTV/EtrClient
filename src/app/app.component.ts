import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { HttpClientModule } from '@angular/common/http';
import { HeaderNewComponent } from './components/header-new/header-new.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, HeaderComponent, HttpClientModule, HeaderNewComponent]
})
export class AppComponent {
  readonly title = 'EtrClient';
  readonly version = [0, 10, 1];
  readonly lastUpdate = new Date('2024.02.04');
}