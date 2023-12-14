import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRow } from '../../models/tableRow';

@Component({
  selector: 'app-table-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-template.component.html',
  styleUrl: './table-template.component.css'
})
export class TableTemplateComponent {
  columnsName:string[] = [];
  rowData:TableRow[] = []; 
}