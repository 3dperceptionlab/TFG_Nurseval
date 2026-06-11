import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-procedures-list',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './procedures-list.html',
  styleUrl: './procedures-list.css',
})
export class ProceduresList {
  icons = {faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple}

  procedures = input<any>();
}
