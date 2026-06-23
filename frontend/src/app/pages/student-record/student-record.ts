import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft, faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { PageSelector } from "../../shared/page-selector/page-selector";
import { ProceduresList } from "./procedures-list/procedures-list";
import { ProcedureService } from '../../services/procedure.service';
import { procedureSummary } from '../../models/procedure.model';
import { ProtocolService } from '../../services/protocol.service';

@Component({
  selector: 'app-student-record',
  imports: [FontAwesomeModule, PageSelector, ProceduresList],
  templateUrl: './student-record.html',
  styleUrl: './student-record.css',
})
export class StudentRecord {
  icons = {faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft, faFaceFrownOpen}

  procedureService = inject(ProcedureService);
  protocolService = inject(ProtocolService);

  selectedKey = signal<string>('Capelina');

  myProcedures = computed<procedureSummary[]>(() => (this.procedureService.myHistoryResource.value() as procedureSummary[]) ?? [])
  
  filteredProcedures = computed(() => {
    if(this.selectedKey() === "Todo") return this.myProcedures();
    return this.myProcedures().filter((p) => p.protocolName === this.selectedKey());
  });
}
