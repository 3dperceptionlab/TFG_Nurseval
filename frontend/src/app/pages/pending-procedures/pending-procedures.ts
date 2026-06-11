import { Component, signal } from '@angular/core';
import { PROTOCOLOS_DATA } from '../../models/protocolos-data';
import { PROFESORES, ALUMNOS, PROCEDIMIENTOS } from '../../models/procedimientos.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-pending-procedures',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './pending-procedures.html',
  styleUrl: './pending-procedures.css',
})
export class PendingProcedures {
  icons = {faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft}

  PROTOCOLOS_DATA = PROTOCOLOS_DATA;
  protocolKeys = Object.keys(PROTOCOLOS_DATA);
  selectedKey = signal<string>('capelina');

  procedimientos = PROCEDIMIENTOS;
}
