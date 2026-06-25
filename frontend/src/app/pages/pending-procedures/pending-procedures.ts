import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft, faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { PageSelector } from "../../shared/page-selector/page-selector";
import { ProceduresList } from "./procedures-list/procedures-list";
import { procedureSummary } from '../../models/procedure.model';
import { ProcedureService } from '../../services/procedure.service';
import { ProtocolService } from '../../services/protocol.service';

@Component({
  selector: 'app-pending-procedures',
  imports: [FontAwesomeModule, PageSelector, ProceduresList],
  templateUrl: './pending-procedures.html',
  styleUrl: './pending-procedures.css',
})
export class PendingProcedures {
  icons = {faArrowRight, faCalendar, faClock, faWarning, faSquareCheck, faChartSimple, faAngleRight, faAngleLeft, faFaceFrownOpen}

  selectedKey = signal<string>('Todo');

  procedureService = inject(ProcedureService);
  protocolService = inject(ProtocolService);

  myStudentsProcedures = computed<procedureSummary[]>(() => (this.procedureService.myStudentProceduresResource.value() as procedureSummary[]) ?? [])
  filteredProcedures = computed(() => {
    if(this.selectedKey() === "Todo") return this.myStudentsProcedures();
    return this.myStudentsProcedures().filter((p) => p.protocolName === this.selectedKey());
  });
}
