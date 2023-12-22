import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild, Directive, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';

export class TableRow {
  contents : (any | null)[] = [];
  stringinfied : (string | null)[] = [];
  routerLinks : (string | null)[] = [];
  htmlString : (string | null)[] = [];
}

class TableRowSafeHTML extends TableRow {
  safeHtml : (SafeHtml | null)[][] = [];
}

export class TableData {
  tableColNames : string[] = [];
  colSortableFlag : boolean[] = [];
  directionPresets : number[] = [];
  tableRows : TableRow[] = [];
}

class TableDataSafeHTML extends TableData {
  override tableRows : TableRowSafeHTML[] = [];
}


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './table-template.component.html',
  styleUrl: './table-template.component.css',
  encapsulation: ViewEncapsulation.None
})

// NEVER give untrusted data to tableData.tableRows.htmlString
export class TableTemplateComponent implements OnInit {
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input() tableData : TableData = null!;

  safeHtml : (SafeHtml | null)[][] = [];
  sortDirections : number[] = [];

  private sanitizer : DomSanitizer;
  //cringe = `<div class="demo"><b>This is my HTML.</b></div>`;

  constructor (private sanitizerInj: DomSanitizer) {
    this.sanitizer = sanitizerInj;
  }

  ngOnInit () {
    this.resetFormSubject.subscribe(response => {if (response) {

        this.tableData.tableColNames.forEach(e => {
          this.sortDirections.push(0);
        });

        if (this.tableData.directionPresets.length !== this.sortDirections.length)
        {
          this.tableData.directionPresets.length = this.sortDirections.length;
          this.tableData.directionPresets.fill(1);
        }

        if (this.tableData.colSortableFlag.length !== this.sortDirections.length)
        {
          this.tableData.colSortableFlag.length = this.sortDirections.length;
          this.tableData.colSortableFlag.fill(true);
        }

        if (!this.tableData.tableRows.every(row => row.contents.length == this.tableData.tableColNames.length))
        {
          for (let i = 0; i < this.tableData.tableRows.length; i++) {
            for (let j = this.tableData.tableRows[i].contents.length; j < this.tableData.tableColNames.length; j++) {
              this.tableData.tableRows[i].contents.push(null);
              this.tableData.colSortableFlag[j] = false;
            }
          }
        }
        
        this.tableData.tableRows.forEach((row, index) => {
          if (row.htmlString.length != 0) { 
            this.safeHtml.push(new Array<Array<SafeHtml>>); 
            row.htmlString.forEach(str => str != undefined && str != null ? 
            this.safeHtml[index].push(this.sanitizer.bypassSecurityTrustHtml(str)) : 
            this.safeHtml[index].push(null));
          }
        });

        console.log(this.tableData);

      }
    });
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
            if (a.stringinfied[colIndex] != null && b.stringinfied[colIndex] != null)
              return (a.stringinfied[colIndex] as string).localeCompare(b.stringinfied[colIndex] as string) * this.sortDirections[colIndex] * this.tableData.directionPresets[colIndex];
          }
          if (typeof a.contents[colIndex] === "number" && typeof b.contents[colIndex] === "number")
            return ((a.contents[colIndex] as number) - (b.contents[colIndex] as number)) * this.sortDirections[colIndex] * this.tableData.directionPresets[colIndex];
          if (typeof a.contents[colIndex] === "string" && typeof b.contents[colIndex] === "string")
          {
            if (a.contents[colIndex] !== "" && b.contents[colIndex] !== "")
              return ((a.contents[colIndex] as string).localeCompare(b.contents[colIndex] as string)) * this.sortDirections[colIndex] * this.tableData.directionPresets[colIndex];
            if (a.contents[colIndex] !== "")
              return -1;
            if (b.contents[colIndex] !== "")
              return 1;
          }
          if (a.stringinfied[colIndex] != undefined)
            return -1;
          if (b.stringinfied[colIndex] != undefined)
            return 1;
          if (a.contents[colIndex] != null)
            return -1;
          if (b.contents[colIndex] != null)
            return 1;
        }
        return 0;
      });
    }
  }
}