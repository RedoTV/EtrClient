import { Component, Input, ElementRef, Renderer2, OnDestroy, AfterViewInit, OnInit, AfterContentChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params } from '@angular/router';
import { Subject, Subscription, noop } from 'rxjs';


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
  colSortableFlag : boolean[] = [];
  ignoreSortingFlags : boolean[] = [];
  hideColumnsFlags : boolean[] = [];

  directionPresets : number[] = [];

  tableColNames : string[] = [];
  tableRows : TableRow[] = [];
}


@Component({
  selector: 'table-template-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-template-new.component.html',
  styleUrl: './table-template-new.component.css'
})

export class TableTemplateNewComponent implements AfterViewInit, OnDestroy, OnInit, AfterContentChecked {

  sortDirections : number[] = [];

  @Input() colSortableFlags : boolean[] = [];

  @Input() ignoreSortingFlags : boolean[] = [];

  @Input() hideColumnsFlags : boolean[] = [];

  /**
   * Negative numbers correspond to sorting from highest to lowest,
   * positive - from lowest to highest in corresponding columns.
   */
  @Input() sortDirectionsPresets : number[] = [];

  @Input() tableUpdate : Subject<boolean> = new Subject<boolean>();
  tableUpdateSubscription : Subscription = new Subscription;
  externalChanges : boolean = false;

  nativeEl : HTMLElement;

  removeClickEventListeners : (() => void)[] = [];
  
  firstContentCheck : boolean = true;

  IDColumn : number = -1;



  constructor (private elRef : ElementRef, private renderer : Renderer2) {
    this.nativeEl = elRef.nativeElement;
  }

  ngOnInit() {
    this.tableUpdateSubscription = this.tableUpdate.subscribe(resetBool => this.externalChanges = resetBool);
  }

  ngAfterContentChecked(): void {
    if (this.externalChanges) {
      this.ngAfterViewInit();
      this.externalChanges = false;
    }
  }

  ngAfterViewInit () {

    let tableHead = Array.from(this.nativeEl.getElementsByTagName('th'));

    this.sortDirections = [];
    this.sortDirections.length = tableHead.length;

    this.sortDirections.fill(0);

    // if (this.colSortableFlags.length < tableHead.length) {
    //   let deltaLen = tableHead.length - this.colSortableFlags.length;
    //   this.colSortableFlags.length = tableHead.length;
    //   this.colSortableFlags.fill(false, deltaLen, this.colSortableFlags.length - 1);
    // }

    if (this.colSortableFlags.length < tableHead.length) {
      this.colSortableFlags.length = tableHead.length;
      this.colSortableFlags.fill(true);
    }

    if (this.ignoreSortingFlags.length < tableHead.length) {
      let initLen = this.ignoreSortingFlags.length;
      this.ignoreSortingFlags.length = tableHead.length;
      this.ignoreSortingFlags.fill(false, initLen, this.ignoreSortingFlags.length);
    }

    if (this.hideColumnsFlags.length < tableHead.length) {
      this.hideColumnsFlags.length = tableHead.length;
      this.hideColumnsFlags.fill(false);
    }

    this.removeClickEventListeners.forEach(removeClickEventListener => removeClickEventListener());

    for (let [index, headCell] of tableHead.entries()) {
      this.removeClickEventListeners.push(this.renderer.listen(headCell, 'click', () => {
        this.sortTable(index);
      }));
    }

    this.IDColumn = tableHead.findIndex(headCell => headCell.id === "ID-col");

    if(this.sortDirectionsPresets.length > 0) {
      let presetCol = this.sortDirectionsPresets.findIndex(val => val != 0);

      if (presetCol != -1) {

        // For whatever reason, it doesn't work properly if sorted once.
        // If sorted once - row, that should be the last one, appears on top.
        // So, the solution is to invert an initial sort direction and double-pass
        // (sort direction is inverted every time table is sorted on the same column)
        // Was tested in Chromium browser, slow 3G preset, it just works...
        this.sortDirections[presetCol] = -this.sortDirectionsPresets[presetCol];
        
        this.sortTable(presetCol);
        this.sortTable(presetCol);
      }
    }
  }

  ngOnDestroy () {
    this.removeClickEventListeners.forEach(removeClickEventListener => removeClickEventListener());

    this.tableUpdateSubscription.unsubscribe();
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
      
      tableHead[colIndex].className = this.sortDirections[colIndex] == 1 ? "sort-start-lower" : "sort-start-higher";

      let tableRows = Array.from(this.nativeEl.getElementsByTagName('tr'));

      /**
       *  This array references elements that are under ignoreSorting flag.
       *  These elements will be just copied back in the same order,
       *  just to bypass sorting
       *  This code is commented out because it's
       *  1. BAD.
       *  2. Not needed anymore.
       */
      // let unsortedCells : (Element | null)[][] = [];

      // tableRows.forEach((row, i) => {
      //   if (row.children.length > 0) {
      //     if (row.children.item(0)?.tagName == 'A' && row.children.item(0)?.tagName == 'A') {
      //       unsortedCells[i] = Array.from(row.children.item(0)!.children);
      //       Array.from(row.children.item(0)!.children).forEach((child, j) => {
      //         this.ignoreSortingFlags[j] ? unsortedCells[i][j] = child : unsortedCells[i][j] = null;
      //       });
      //     }
      //     else {
      //       unsortedCells[i] = Array.from(row.children);
      //       Array.from(row.children).forEach((child, j) => {
      //       this.ignoreSortingFlags[j] ? unsortedCells[i][j] = child : unsortedCells[i][j] = null;
      //       });
      //     }
      //   }
        
      // });

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

      let table = Array.from(this.nativeEl.getElementsByTagName('table'))[0];
      

      /**
       *  Same thing applies here
       */
      // inserting cells that are "ignored" in sorting
      // tableRows.forEach((row, i) => {
      //   if (row.children.length > 0) {
      //     // checks for link - if present, replaces it's cells
      //     if (row.children.item(0)?.tagName == 'A' && row.children.item(0)?.tagName == 'A') {

      //       unsortedCells[i].forEach((cell, cellIndex) => {
      //         if (cell != null) {
      //           row.children.item(0)?.replaceChild(cell.cloneNode(true), row.children.item(0)!.childNodes.item(cellIndex));
      //         }
      //       });
      //     }
      //     // if not - replaces cells of the row itself
      //     else {
      //       unsortedCells[i].forEach((cell, cellIndex) => {
      //         if (cell != null) {
      //           row.replaceChild(cell.cloneNode(true), row.childNodes.item(cellIndex));
      //         }
              
      //       });
      //     }
      //   }
      // });
      
      // placing everything back into the table, but now sorted
      tableRows.forEach(row => {table.removeChild(row); table.appendChild(row as Node);});

      // Filling static ID's.
      // But first, we update our rows
      tableRows = Array.from(this.nativeEl.getElementsByTagName('tr'));

      tableRows.forEach((row, i) => {
        if (row.children.length > 0) {
          if (row.children.item(0)?.tagName == 'A' && row.children.item(0)?.tagName == 'A') {
            let idCell = row.children.item(0)?.children.item(this.IDColumn);
            if(idCell != null) 
              idCell.textContent = `${i + 1}`;
          }
          else {
            let idCell = row.children.item(this.IDColumn);
            if(idCell != null) 
              idCell.textContent = `${i + 1}`;
          }
        }
      });

    }
  }
}
