import { Component, model, ModelSignal, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEraser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FilterParams } from '../../../models/student.model';



@Component({
  selector: 'app-filters',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})

export class Filters {
  icons = { faEraser, faSearch }

  courseFilter = model('');
  groupFilter = model('');
  query = '';

  filtersChange = output<FilterParams>();

  onFilterChange(filter: ModelSignal<any>, event: Event) {
    const select = event.target as HTMLSelectElement;
    filter.set(select.value);
    this.emit();
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.emit();
  }

  onClear() {
    this.courseFilter.set('');
    this.groupFilter.set('');
    this.query = '';
    this.emit();
  }

  private emit() {
    this.filtersChange.emit({
      query: this.query.trim(),
      course: this.courseFilter(),
      group: this.groupFilter(),
    });
  }
}