import { Component, Input, ElementRef, AfterViewChecked, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';

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
