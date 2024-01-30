import { Component, Input, ElementRef, AfterViewChecked, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params } from '@angular/router';

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
  selector: 'table-template-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-template-new.component.html',
  styleUrl: './table-template-new.component.css'
})

export class TableTemplateNewComponent implements AfterViewInit, OnDestroy {

  sortDirections : number[] = [];
  @Input() colSortableFlags : boolean[] = [];
  nativeEl : HTMLElement;

  removeClickEventListener : () => void = () => {};

  constructor (private elRef : ElementRef, private renderer : Renderer2) {
    this.nativeEl = elRef.nativeElement;
  }

  ngAfterViewInit () {

    let tableHead = Array.from(this.nativeEl.getElementsByTagName('th'));

    this.sortDirections.length = tableHead.length;

    this.sortDirections.fill(0);

    if (this.colSortableFlags.length < tableHead.length) {
      this.colSortableFlags.length = tableHead.length;
      this.colSortableFlags.fill(true);
    }

    for (let [index, headCell] of tableHead.entries()) {
      this.removeClickEventListener = this.renderer.listen(headCell, 'click', () => {
        this.sortTable(index);
      });
    }
  }

  ngOnDestroy () {
    this.removeClickEventListener();
  }

  sortTable(colIndex : number) {
    if (this.colSortableFlags[colIndex]) {
      
      this.sortDirections.fill(0, 0, colIndex);
      this.sortDirections.fill(0, colIndex + 1, this.sortDirections.length);
      
      this.sortDirections[colIndex] == -1 ? 
      this.sortDirections[colIndex] = 1 : 
      this.sortDirections[colIndex] = -1;

      let tableHead = Array.from(this.nativeEl.getElementsByTagName('th'));
      tableHead.forEach(element => {
        element.className = "";
      });
      
      tableHead[colIndex].className = this.sortDirections[colIndex] == 1 ? "sort-start-higher" : "sort-start-lower";

      let tableRows = Array.from(this.nativeEl.getElementsByTagName('tr'));

      tableRows.pop(); //popping invisible tr tag out of the array

      tableRows.sort((a, b) => {
        let aVal, bVal;
        if (a.children.item(0)!.tagName == 'A' && b.children.item(0)!.tagName == 'A') {
          aVal = a.children.item(0)!.children.item(colIndex)!.textContent;
          bVal = b.children.item(0)!.children.item(colIndex)!.textContent;
        }
        else {
          aVal = a.children.item(colIndex)!.textContent;
          bVal = b.children.item(colIndex)!.textContent;
        }

          if (aVal == null || aVal.trim() == "")
            return 1;
          if (bVal == null || bVal.trim() == "")
            return -1;

          if (!isNaN(Number(aVal)) && !isNaN(Number(bVal)))
            return (Number(aVal) - Number(bVal)) * this.sortDirections[colIndex]; 
          
          return aVal!.localeCompare(bVal!) * this.sortDirections[colIndex]; 

      });

      let table = Array.from(this.nativeEl.getElementsByTagName('table'));
      let bottomTrPad = table[0].lastElementChild;
      table[0].removeChild(bottomTrPad! as Node);
      
      tableRows.forEach((row, index) => {table[0].removeChild(row); table[0].appendChild(row as Node);});
      table[0].appendChild(bottomTrPad!);

    }
  }
}
