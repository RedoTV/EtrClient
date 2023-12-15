import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-template.component.html',
  styleUrl: './table-template.component.css'
})

export class TableTemplateComponent {
  @Input() tableColNames : string[] = [];
  @Input() directionPresets : number[] = [];
  @Input() tableContents : any[][] = [];
  sortDirections : number[] = [];

  constructor () {
    this.tableColNames.push("kek");
    this.tableContents.push(["lorem ipsum", "dolot sit amer."], ["dolot sit amer.", "lorem"]);
    this.tableColNames.push("kek");
    this.tableColNames.forEach(element => {
      this.sortDirections.push(0);
    });
    if(this.directionPresets.length !== this.sortDirections.length)
    {
      this.directionPresets = this.sortDirections;
      this.directionPresets.fill(0);
    }
  }

  sortTable(colIndex : number) {

    this.sortDirections.fill(0, 0, colIndex);
    this.sortDirections.fill(0, colIndex + 1, this.sortDirections.length);
    this.sortDirections[colIndex] == 1 ? 
    this.sortDirections[colIndex] = -1 : 
    this.sortDirections[colIndex] = 1;
    console.log(this.sortDirections[colIndex]);

    this.tableContents.sort((a, b) => {
      if (a[colIndex] && b[colIndex] && a && b)
      {
        if (typeof a[colIndex] === "number" && typeof b[colIndex] === "number")
          return (a[colIndex] as number) - (b[colIndex] as number) * this.sortDirections[colIndex];
        if (typeof a[colIndex] === "string" && typeof b[colIndex] === "string")
          return (a[colIndex] as string).localeCompare(b[colIndex] as string) * this.sortDirections[colIndex];
      }
      return 0;
    });
  }
}