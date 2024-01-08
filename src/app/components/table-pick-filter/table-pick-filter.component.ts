import { filter } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export class FilterCategory {
  name : string = "none";
  values : Set<string> = new Set<string>;
}

@Component({
  selector: 'app-table-pick-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-pick-filter.component.html',
  styleUrl: './table-pick-filter.component.css'
})
export class TablePickFilterComponent {
  @Input({required: true}) filterCathegories : FilterCategory[] = [];

  /**
   * Filter categories with the same names as in input ones, 
   * but only values that where selected are included
   * You can check if values array empty to disable table data filtering.
   * 
   * Категории фильтра с теми же именами, как и на входных,
   * только сюда включены исключительно выбранные значения
   */
  @Output() filterFeedback = new EventEmitter<FilterCategory[]>();

  filteredValues : FilterCategory[] = [];


  deselectValue(categoryName : string, value : string) {
    this.filterCathegories.filter(filterCat => {
      return filterCat.name == categoryName;
    })[0].values.add(value);

    this.filteredValues.filter(filterCat => {
      return filterCat.name == categoryName;
    })[0].values.delete(value);

    this.filterFeedback.emit(this.filteredValues);
  }
  
  selectValue(categoryName : string, value : string) {
    if (this.filteredValues.filter(filterCat => {return filterCat.name == categoryName}).length == 0)
    {
      let missingCategory : FilterCategory = new FilterCategory;
      missingCategory.name = categoryName;
      this.filteredValues.push(missingCategory);
    }

    this.filteredValues.filter(filterCat => {
      return filterCat.name == categoryName;
    })[0].values.add(value);

    this.filterCathegories.filter(filterCat => {
      return filterCat.name == categoryName;
    })[0].values.delete(value);

    this.filterFeedback.emit(this.filteredValues);
  }

}
