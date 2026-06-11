import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEraser, faSearch } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-filters',
  imports: [FontAwesomeModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  icons = { faEraser, faSearch }
}
