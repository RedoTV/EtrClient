import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild, Directive, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { Buffer } from 'buffer/';

export class TableRow {
  contents : (any | null)[] = [];
  stringinfied : (string | null)[] = [];
  /**
   * Link used for routing, used as routerLink for the whole row.
   * If you dont need to link anything - just don't give it value.
   * 
   * Ссылка для роутинга, используется как routerLink для всей строки.
   * Если не нужно ничего связывать - можно просто не передавать значение.
   */
  routerLink : string | null = null;
  //routerLinks : (string | null)[] = []; - obsolete
  queryParams : Params | null = null;
  /**
   * This string array is used by the table-template, which uses
   * every string of array as HTML code of according cell of the row.
   * Be warned - table-template bypasses DOM sanitizer 
   * to display strings as HTML, but allows for usage of different attributes.
   * 
   * Данный массив строк используется table-template -ом, который
   * использует каждую строку массива как HTML код соответствующей ячейки
   * строки. Предупреждение - table-template обходит санитизацию DOM
   * для отображения строк как HTML, что делает его менее безопасным,
   * но позволяет использовать различные аттрибуты.
   */
  htmlString : (string | null)[] = [];
}

/** 
 * UI table data class that holds contents for every cell, routerLink for every cell, column names.
 * 
 * Also can hold and show HTML code in tableRows.htmlString array, BUT
 * NEVER give untrusted data to tableRows.htmlString.
 * 
 * It bypasses DOM sanitizer!
*/
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
  styleUrl: './table-template.component.css',
})


/** 
 * UI table template, has TableData as input and displays data from it's
 * arrays according to their designation.
 * 
 * Be warned, again, for html data it bypasses sanitizer to allow styles,
 * so that you wouldn't have to edit table-template css and just give some
 * styles with html.
*/
export class TableTemplateComponent implements OnInit {
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input({required: true}) tableData : TableData = null!;

  safeHtml : (SafeHtml | null)[][] = [];
  sortDirections : number[] = [];



  constructor (private sanitizer: DomSanitizer) {}

  /**
   * Subscirbes to resetFormSubject to update the table when it's true.
   * Use to update the table when new data was given to it.
   * 
   * Подписка на resetFormSubject для обновлении таблицы когда даётся значение true.
   * Используй для обновления таблицы когда ей были переданы новые данные.
   */
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

        this.refreshHTML();
        
        this.tableData.tableRows.forEach((row, index) => {
          if (row.queryParams != null)
              row.queryParams['href'] = Buffer.from(row.queryParams['href'], 'base64').toString('binary');
        });

      }
    });
  }
  /**
   * Method used to handle all of the sorting.
   * 
   * Метод используемый для всего связанного с сортировкой
   */
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

    this.refreshHTML();

  }

  refreshHTML () {
    this.safeHtml = [];
    this.tableData.tableRows.forEach((row, index) => {
      if (row.htmlString.length != 0) { 
        this.safeHtml.push(new Array<Array<SafeHtml>>); 
        row.htmlString.forEach(str => str != undefined && str != null ? 
        this.safeHtml[index].push(this.sanitizer.bypassSecurityTrustHtml(str)) : 
        this.safeHtml[index].push(null));
      }
    });
  }

}