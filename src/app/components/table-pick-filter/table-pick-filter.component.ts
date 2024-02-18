import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { waitForAsync } from '@angular/core/testing';

export class FilterCategory {
  type : string = "";
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
export class TablePickFilterComponent implements AfterViewChecked {

  @Input({required: true}) filterCategories : FilterCategory[] = [];

  /**
   * Filter categories with the same names as in input ones, 
   * but only values that where selected are included.
   * You can check if values array empty to disable table data filtering.
   * 
   * Категории фильтра с теми же именами, как и на входных,
   * только сюда включены только выбранные значения.
   */
  @Output() filterFeedback = new EventEmitter<FilterCategory[]>();

  filteredValues : FilterCategory[] = [];

  checkTrigger : boolean = true;
  rootElement : Element;

  constructor(private activatedRoute : ActivatedRoute, private router : Router, elementRef : ElementRef) {
    this.rootElement = elementRef.nativeElement;
  }

  ngAfterViewChecked () {
    if (this.filterCategories.length != 0 && this.checkTrigger) {
      this.checkTrigger = false;

      let searchCategory = this.filterCategories.find(category => category.type === "search");
      if (this.activatedRoute.queryParams && searchCategory)
      {
        let searchStr : string;
        this.activatedRoute.queryParams.subscribe(params => {
          searchStr = params['searchStr'];

          if (typeof(searchStr) == 'string') {
            searchStr.split(' ').forEach(word => searchCategory!.values.add(word));
          }

          this.search(searchStr);
          this.fillSearchbar(searchStr);

        }).unsubscribe();

      }
    }

  }


  deselectValue (categoryName : string, value : string) {
    this.filterCategories.filter(filterCat => {
      return filterCat.name == categoryName;
    })[0].values.add(value);


    let matchedCategory = this.filteredValues.filter(filterCat => filterCat.name == categoryName)[0];
    matchedCategory.values.delete(value);

    this.filterFeedback.emit(this.filteredValues);
  }
  
  selectValue (categoryName : string, value : string) {
    if (this.filteredValues.findIndex(filterCat => filterCat.name === categoryName) === -1)
    {
      let missingCategory : FilterCategory = new FilterCategory;
      missingCategory.name = categoryName;
      this.filteredValues.push(missingCategory);
    }

    this.filteredValues.filter(filterCat => {
      return filterCat.name == categoryName;
    })[0].values.add(value);

    this.filterCategories.filter(filterCat => {
      return filterCat.name == categoryName;
    })[0].values.delete(value);

    this.filterFeedback.emit(this.filteredValues);
  }

  searchTrigger (event : Event) {
    let searchQuery = (event.target as HTMLInputElement).value;
    this.search(searchQuery);
  }

  search (searchQuery : string) {
    let searchCategory = this.filterCategories.find(cathegory => cathegory.type === "search");

    if (searchCategory) {
      searchCategory.values.clear();
      searchQuery.split(' ').forEach(word => searchCategory?.values.add(word));

      var state = { searchStr: Array.from(searchCategory.values).join(' ')}; 
      var url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: state }).toString();
      this.router.navigateByUrl(url);

      this.filterFeedback.emit([searchCategory]);
    }
  }

  fillSearchbar (value : string) {
    let searchbar = this.rootElement.getElementsByClassName('filter-searchbar').item(0) as HTMLInputElement | null;
    
    if (searchbar)
      searchbar.value = value;
  }

}
