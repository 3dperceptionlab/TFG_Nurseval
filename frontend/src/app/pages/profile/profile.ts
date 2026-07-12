import { Component, computed, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faGraduationCap, faUserGroup, faChartLine, faTriangleExclamation, faBullseye, faEye } from '@fortawesome/free-solid-svg-icons';
import { BaseChartDirective } from 'ng2-charts';
import { StudentService } from '../../services/students.service';
import { Auth } from '../../services/auth.service';
import { ProfessorService } from '../../services/professor.service';
import { EditForm } from "./edit-form/edit-form";
import { ProtocolService } from '../../services/protocol.service';

@Component({
  selector: 'app-profile',
  imports: [FontAwesomeModule, BaseChartDirective, EditForm],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  icons = { faPen, faGraduationCap, faUserGroup, faChartLine, faTriangleExclamation, faBullseye, faEye };
  
  studentService = inject(StudentService);
  professorService = inject(ProfessorService);
  authService = inject(Auth);
  protocolService = inject(ProtocolService);

  showEditModal = signal(false);
  readonly chartColors = ['#009ea9', '#067077', '#8cd8dd', '#4b5563', '#E39366'];

  isProfessor = computed(() => this.authService.userRole() === 'professor');

  userData = computed<any>(() => {
    const role = this.authService.userRole();
    if (role === 'student') return this.studentService.profileResource.value() ?? {};
    if (role === 'professor') return this.professorService.profileResource.value() ?? {};
    return {};
  });
  
  stats = computed<any>(() => {
    return this.isProfessor() 
      ? this.professorService.myStatsResource.value() ?? {} 
      : this.studentService.myStatsResource.value() ?? {};
  });

  kpis = computed(() => {
    const s = this.stats();
    return [
      { label: 'Nota Media', value: s.avgMark ?? 0, icon: this.icons.faChartLine, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Optimizaciones Media', value: (s.avgAttention ?? 0), icon: this.icons.faEye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Errores Medios', value: s.avgErrors ?? 0, icon: this.icons.faTriangleExclamation, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];
  });

  topStudents = computed(() => {
    if (!this.isProfessor()) return [];
    return this.stats()?.studentRanking?.slice(0, 5) ?? [];
  });

  byProtocolFull = computed(() => {
    const protocols = this.protocolService.protocolkeys() ?? [];
    const real = this.stats()?.byProtocol ?? [];
    return protocols.map((name) => {
      const found = real.find((p: any) => p.protocolName === name);
      return found ?? { protocolName: name, total: 0, passed: 0, failed: 0, avgMark: 0 };
    });
  });

  barChart = computed(() => {
    const protocolStats = this.stats()?.byProtocol ?? [];
    const labels = protocolStats.map((p: any) => p.protocolName);
    return {
      data: {
        labels,
        datasets: [
          { label: 'Aprobados', data: protocolStats.map((p: any) => p.passed), backgroundColor: '#67E3E0' },
          { label: 'Suspensos', data: protocolStats.map((p: any) => p.failed), backgroundColor: '#E39366' }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { grid: { display: false }, 
        ticks: {
            // truncar etiquetas largas
            callback: function(this: any, value: any, index: number, values: any): string {
              const label = this.getLabelForValue(value) as string;
              return label.length > 15 ? label.substring(0, 15) + '...' : label;
            }
        } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    };
  });

  lineBarChartTotal = computed(() => {
    const byMonth = this.stats()?.byMonth ?? [];
    const labels = byMonth.map((m: any) => this.monthLabel(m.month, m.year));
    return {
      data: {
        labels,
        datasets: [
          { type: 'bar' as const, label: 'Prácticas Totales', data: byMonth.map((m: any) => m.total), backgroundColor: 'rgba(227, 147, 102, 0.4)', borderColor: '#E39366', yAxisID: 'y' },
          { type: 'line' as const, label: 'Nota Media', data: byMonth.map((m: any) => m.avgMark), borderColor: '#E39366', tension: 0.3, yAxisID: 'y1' }
        ]
      },
      chartOptions: this.getMixedChartOptions('Prácticas', 'Nota')
    };
  });


  ngOnInit() {
    if (this.authService.userRole() === 'professor') {
      this.professorService.myStatsResource.reload();
    } else if (this.authService.userRole() === 'student') {
      this.studentService.myStatsResource.reload();
    }
  }

  getProtocolChart(protocolName: string, colorIndex: number) {
    const byMonth = this.stats()?.byMonth ?? [];
    const color = this.chartColors[colorIndex] ?? '#009ea9';
    return {
      data: {
        labels: byMonth.map((m: any) => this.monthLabel(m.month, m.year)),
        datasets: [
          { type: 'bar' as const, label: 'Prácticas', data: byMonth.map((m: any) => m.totalByProtocol?.[protocolName] ?? 0), backgroundColor: color + '66', yAxisID: 'y' },
          { type: 'line' as const, label: 'Nota Media', data: byMonth.map((m: any) => m.avgMarkByProtocol?.[protocolName] ?? null), borderColor: color, yAxisID: 'y1' }
        ]
      },
      chartOptions: this.getMixedChartOptions('Prácticas', 'Nota')
    };
  }

  getMixedChartOptions(yLabel: string, y1Label: string) {
    return {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, position: 'left' as const, title: { display: true, text: yLabel } },
        y1: { beginAtZero: true, position: 'right' as const, max: 10, grid: { drawOnChartArea: false }, title: { display: true, text: y1Label } }
      }
    };
  }

  doughnutChart = computed(() => {
    const byProtocol = this.stats()?.byProtocol ?? [];
    return {
      data: {
        labels: byProtocol.map((p: any) => p.protocolName),
        datasets: [{ data: byProtocol.map((p: any) => p.total), backgroundColor: this.chartColors }]
      },
      chartOptions: { cutout: '70%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    };
  });

  private monthLabel(month: number, year: number): string {
    const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${names[month - 1]} ${year}`;
  }
}