import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export class TableRow {
  contents : any[] = [];
  stringinfied : (string | null)[] = [];
  routerLinks : (string | null)[] = [];
}

export class TableData {
  tableColNames : string[] = [];
  colSortableFlag : boolean[] = [];
  directionPresets : number[] = [];
  tableRows : TableRow[] = [];
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './table-template.component.html',
  styleUrl: './table-template.component.css'
})

export class TableTemplateComponent implements OnChanges {
  @Input({required: true}) tableData : TableData = null!;
  sortDirections : number[] = [];

  constructor () {}

  ngOnChanges () {
    console.log(this.tableData);
    this.tableData.tableColNames.forEach(e => {
      this.sortDirections.push(0);
    });
    if(this.tableData.directionPresets.length !== this.sortDirections.length)
    {
      this.tableData.directionPresets.length = this.sortDirections.length;
      this.tableData.directionPresets.fill(1);
    }
    if(this.tableData.colSortableFlag.length !== this.sortDirections.length)
    {
      this.tableData.colSortableFlag.length = this.sortDirections.length;
      this.tableData.colSortableFlag.fill(true);
    }
  }

  sortTable(colIndex : number) {
    if (this.tableData.colSortableFlag[colIndex]) {
      this.sortDirections.fill(0, 0, colIndex);
      this.sortDirections.fill(0, colIndex + 1, this.sortDirections.length);
      this.sortDirections[colIndex] == 1 ? 
      this.sortDirections[colIndex] = -1 : 
      this.sortDirections[colIndex] = 1;

      this.tableData.tableRows.sort((a, b) => {
        if (a != null && b != null && a && b)
        {
          if (a.stringinfied[colIndex] != undefined && b.stringinfied[colIndex] != undefined)
          {
            if (a.stringinfied[colIndex] != null && b.stringinfied.at(colIndex) != null)
              return (a.stringinfied[colIndex] as string).localeCompare(b.stringinfied[colIndex] as string) * this.sortDirections[colIndex] * this.tableData.directionPresets[colIndex];
          }
          if (typeof a.contents[colIndex] === "number" && typeof b.contents[colIndex] === "number")
            return ((a.contents[colIndex] as number) - (b.contents[colIndex] as number)) * this.sortDirections[colIndex] * this.tableData.directionPresets[colIndex];
          if (typeof a.contents[colIndex] === "string" && typeof b.contents[colIndex] === "string")
            return ((a.contents[colIndex] as string).localeCompare(b.contents[colIndex] as string)) * this.sortDirections[colIndex] * this.tableData.directionPresets[colIndex];
          if (a.stringinfied[colIndex] == undefined && b.stringinfied[colIndex] != undefined)
            return 1;
          if (a.stringinfied[colIndex] != undefined && b.stringinfied[colIndex] == undefined)
            return -1;
        }
        return 0;
      });
    }
  }
}