import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { waitForAsync } from '@angular/core/testing';
import { ExternalReference } from '@angular/compiler';

export class FilterCategory {
  type : string = "";
  name : string = "none";
  varName : string = "none";
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

  @Input() filterCategories : FilterCategory[] = [];

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
        let params = this.activatedRoute.snapshot.queryParamMap;

        this.filterCategories.forEach(category => {
          let param = params.get(category.varName);
          let newCategory = new FilterCategory;

          if (param) {
            param.split('\n').forEach(value => {newCategory.values.add(value); category.values.delete(value)});
          }

          newCategory.name = category.name;
          newCategory.type = category.type;
          newCategory.varName = category.varName;

          if (newCategory.type == 'search') {
            this.fillSearchbar(Array.from(newCategory.values).join(' '));
          }

          this.filteredValues.push(newCategory);
        });
        

        // searchStr = params.get('search');

        // if (typeof(searchStr) == 'string') {
        //   searchStr.split(' ').forEach(word => searchCategory!.values.add(word));
        // }

        //this.search(searchStr);
        //this.fillSearchbar(searchStr);

        this.refreshRoute();

      }
    }

  }


  deselectValue (categoryName : string, value : string) {

    var chosenFilterCat = this.filterCategories.filter(filterCat => filterCat.name == categoryName)[0];
    chosenFilterCat.values.add(value);

    let matchedCategory = this.filteredValues.filter(filterCat => filterCat.name == categoryName)[0];
    matchedCategory.values.delete(value);

    if (matchedCategory.type == 'search') {
      this.fillSearchbar(Array.from(matchedCategory.values).join(' '));
    }

    this.refreshRoute();
  }
  
  selectValue (categoryName : string, value : string) {
    if (this.filteredValues.findIndex(filterCat => filterCat.name === categoryName) === -1)
    {
      let missingCategory : FilterCategory = new FilterCategory;
      let givenCategory = this.filterCategories.find(category => category.name === categoryName);

      if (givenCategory) {
        missingCategory.name = categoryName;
        missingCategory.type = givenCategory.type;
        missingCategory.varName = givenCategory.varName;

        this.filteredValues.push(missingCategory);
      }
    }

    var chosenFilterCat = this.filterCategories.filter(filterCat => filterCat.name == categoryName)[0];
    chosenFilterCat.values.delete(value);

    var matchedCategory = this.filteredValues.filter(filterCat => filterCat.name == categoryName)[0];
    matchedCategory.values.add(value);

    this.refreshRoute();
  }

  searchTrigger (event : Event) {
    let searchQuery = (event.target as HTMLInputElement).value;
    this.search(searchQuery);
  }

  search (searchQuery : string) {
    let searchCategory = this.filteredValues.find(cathegory => cathegory.type === "search");
    if(!searchCategory)
    {
      searchCategory = this.filterCategories.find(cathegory => cathegory.type === "search");
      if (searchCategory)
        this.filteredValues.push(searchCategory);
    }

    if (searchCategory) {
      searchCategory.values.clear();
      searchQuery.split(' ').forEach(word => searchCategory!.values.add(word));

      this.refreshRoute();
    }
  }

  fillSearchbar (value : string) {
    let searchbar = this.rootElement.getElementsByClassName('filter-searchbar').item(0) as HTMLInputElement | null;
    
    if (searchbar)
      searchbar.value = value;
  }

  refreshRoute () {
    var params : Params = {};
    this.filteredValues.forEach(matchedCategory => {
      params[matchedCategory.varName] = Array.from(matchedCategory.values).join('\n');
    });

    var mathcedCategories = this.filteredValues.filter(category => category.values.size > 0);
    console.log(mathcedCategories);

    var url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: params }).toString();

    this.router.navigateByUrl(url).then(() => {
      if (mathcedCategories)
        this.filterFeedback.emit(mathcedCategories);
    });
  }

}
