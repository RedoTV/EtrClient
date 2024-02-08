import { Component, Input, ElementRef, Renderer2, OnDestroy, AfterViewInit, OnInit, AfterContentChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params } from '@angular/router';
import { Subject, Subscription, noop } from 'rxjs';


export class TableRow {
  contents : (any | null)[] = [];
  stringinfied : (string | null)[] = [];
  routerLink : string | null = null;
  queryParams : Params | null = null;
}

/** 
 * A class to organize and prepare data to use with table template.
 * It is completely up to you to use it.
*/
export class TableData {
  colSortableFlag : boolean[] = [];

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

  /**
   * Saves current directions of table sorting
   */
  sortDirections : number[] = [];

  /**
   * Make columns unsortable - while cells still will be a part
   * of their rows, user will not be able to sort table by the
   * contents of the cells in this column.
   */
  @Input() colSortableFlags : boolean[] = [];

  /**
   * Negative numbers correspond to sorting from highest to lowest,
   * positive - from lowest to highest in corresponding columns.
   */
  @Input() sortDirectionsPresets : number[] = [];

  /**
   * Used to update the table after new data was given.
   * 
   * Should always be used if new columns or columns' flags
   * added, because in other case behavior of sorting
   * can be quite unexpected.
   */
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
    this.tableUpdateSubscription = this.tableUpdate.subscribe(changes => this.externalChanges = changes);
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

    if (this.colSortableFlags.length < tableHead.length) {
      this.colSortableFlags.length = tableHead.length;
      this.colSortableFlags.fill(true);
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

  /**
   * Handles table sorting
   * @param colIndex 
   * Index of column which will be sorted. It is set by
   * click event on according column head cell.
   */
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

      tableRows.sort((a, b) => {
        let aCell, bCell;
        if (a.children.item(0)!.tagName == 'A' && b.children.item(0)!.tagName == 'A') {
          aCell = a.children.item(0)!.children.item(colIndex)!;
          bCell = b.children.item(0)!.children.item(colIndex)!;
        }
        else {
          aCell = a.children.item(colIndex)!;
          bCell = b.children.item(colIndex)!;
        }

        let aVal = aCell.getAttribute('data-sortingoverride')
        if (aVal === null)
          aVal = aCell.textContent;

        let bVal = bCell.getAttribute('data-sortingoverride')
        if (bVal === null)
          bVal = bCell.textContent;


          if (aVal == null || aVal.trim() == "")
            return 1;
          if (bVal == null || bVal.trim() == "")
            return -1;
            
          if (!isNaN(Number(aVal)) && !isNaN(Number(bVal)))
            return (Number(aVal) - Number(bVal)) * this.sortDirections[colIndex];
          
          return aVal!.localeCompare(bVal!) * this.sortDirections[colIndex];
      });
      
      let table = Array.from(this.nativeEl.getElementsByTagName('table'))[0];
      
      // placing everything back into the table, but now sorted
      tableRows.forEach(row => {table.removeChild(row); table.appendChild(row as Node);});

      // Filling static ID's.
      // But first, we update our rows
      tableRows = Array.from(this.nativeEl.getElementsByTagName('tr'));

      // Fills all cells in column with ID-col class with static id's
      // from 1 to n, n - number of rows.
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
