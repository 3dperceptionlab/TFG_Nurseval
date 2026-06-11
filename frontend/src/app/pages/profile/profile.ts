import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faXmark, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { ChartType } from 'chart.js';
import { BaseChartDirective, } from 'ng2-charts';
import { PROCEDIMIENTOS } from '../../models/procedimientos.model';
import { email, form, required, submit, FormField } from '@angular/forms/signals';
import { profileData } from '../../models/forms.model';

@Component({
  selector: 'app-profile',
  imports: [FontAwesomeModule, BaseChartDirective, FormField],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  icons = { faXmark, faUser, faEnvelope, faPen, faLock }
  role = "student"
  showEditModal = signal(false);
  procedures = signal<any[]>(PROCEDIMIENTOS);

  private readonly colors = {
    capelina: '#009ea9',
    brazo: '#067077',
    pierna: '#8cd8dd',
    total: '#4b5563'
  };
  
  doughnutChart = {
    type: 'doughnut',
    data: {
      labels: [
        'Capelina',
        'Muñeca-brazo',
        'Tobillo-pierna'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [13, 5, 23],
        backgroundColor: [
          '#009ea9',
          '#067077',
          '#8cd8dd'
        ],
        hoverOffset: 4
      }]
    },
    chartOptions: {
      plugins: {
        legend: {
          display: false 
        }
      },
      cutout: '60%', 
      responsive: true,
      maintainAspectRatio: false
    }
  };

  barChart = {
    type: 'bar',
    data: {
      labels: [
        'Capelina',
        'Muñeca-brazo',
        'Tobillo-pierna'
      ],
      datasets: [
      {
        label: '% Aprobados',
        data: [9, 4, 13],
        backgroundColor: '#67E3E0'
      },
      {
        label: '% Suspendidos',
        data: [4, 1, 10],
        backgroundColor: '#E39366'
      }
    ]
    },
    chartOptions: {
      plugins: {
        legend: {
          display: false 
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    }
  }

  lineBarChartTotal = {
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          type: 'bar' as const,
          label: 'Prácticas Totales',
          data: [25, 30, 22, 35, 45, 38, 15, 10, 28, 40, 35, 42],
          backgroundColor: 'rgba(227, 147, 102, 0.4)', 
          borderColor: '#E39366',
          order: 2,
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: 'Nota Media General',
          data: [7.2, 7.8, 8.1, 7.5, 8.9, 8.4, 7.0, 7.5, 8.2, 8.8, 8.5, 9.1],
          borderColor: '#E39366',         
          pointBackgroundColor: '#E39366',
          pointRadius: 5,
          tension: 0.3,
          order: 1,
          yAxisID: 'y1',
        }
      ]
    },
    chartOptions: this.getMixedChartOptions('Prácticas', 'Nota')
  };

  // mix capelina
  lineBarChartCapelina = {
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          type: 'bar' as const,
          label: 'Prácticas',
          data: [8, 10, 5, 12, 15, 10, 4, 2, 8, 12, 10, 14],
          backgroundColor: 'rgba(0, 158, 169, 0.4)',
          order: 2,
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: 'Nota Media',
          data: [6.5, 7.0, 7.5, 8.0, 8.5, 8.0, 7.5, 7.0, 8.0, 8.5, 9.0, 9.5],
          borderColor: this.colors.capelina,
          pointBackgroundColor: this.colors.capelina,
          pointRadius: 5,
          order: 1,
          yAxisID: 'y1',
        }
      ]
    },
    chartOptions: this.getMixedChartOptions('Prácticas', 'Nota')
  };

  // mix brazo
  lineBarChartBrazo = {
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          type: 'bar' as const,
          label: 'Prácticas',
          data: [5, 8, 7, 6, 10, 8, 3, 2, 6, 9, 8, 10],
          backgroundColor: 'rgba(6, 112, 119, 0.4)', 
          order: 2,
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: 'Nota Media',
          data: [8.5, 8.0, 8.2, 8.8, 9.0, 8.7, 8.5, 8.0, 8.8, 9.2, 9.0, 9.5],
          borderColor: this.colors.brazo,
          pointBackgroundColor: this.colors.brazo,
          pointRadius: 5,
          order: 1,
          yAxisID: 'y1',
        }
      ]
    },
    chartOptions: this.getMixedChartOptions('Prácticas', 'Nota')
  };

  // mix pierna
  lineBarChartPierna = {
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          type: 'bar' as const,
          label: 'Prácticas',
          data: [12, 12, 10, 15, 20, 18, 8, 6, 14, 18, 16, 18],
          backgroundColor: 'rgba(140, 216, 221, 0.5)',
          order: 2,
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: 'Nota Media',
          data: [7.0, 7.2, 7.5, 7.1, 7.8, 7.9, 7.5, 7.2, 8.0, 8.2, 8.1, 8.5],
          borderColor: this.colors.pierna,
          pointBackgroundColor: this.colors.pierna,
          pointRadius: 5,
          order: 1,
          yAxisID: 'y1',
        }
      ]
    },
    chartOptions: this.getMixedChartOptions('Prácticas', 'Nota')
  };


  // Datos del usuario
  usuario = signal({
    nombre: 'Abraham',
    apellidos: 'Cortés López',
    curso: 'cuarto',
    grupo: 'grupo 2',
    profesor: 'Lucía Villalobos',
    notaMedia: '8/10',
    email: 'abraham.cortes@example.com',
  });

  profileModel = signal<profileData>({
    email: '',
    password: '',
    repassword: '',
    name: '',
    surname: '',
    position:'',
  });

  profileForm = form(this.profileModel, (u) => {
    required(u.email, {message: 'Este campo es obligatorio.'});
    required(u.password, {message: 'Este campo es obligatorio.'});
    email(u.email, {message: 'El email no es válido.'});
  });

  ngOninit() {
    // llamada al service
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.profileForm, async (validValues) => {
      try {
        console.log('Datos válidos listos para enviar:', validValues().controlValue().email, validValues().controlValue().password);

        this.showEditModal.set(false);
        this.profileForm().reset();
      } catch (error) {
        console.error("Error enviando el formulario", error);
      }
    });
  }

  // Abrir modal cargando los datos actuales
  openModal() {
    this.showEditModal.set(true);
  }

  getMixedChartOptions(yLabel: string, y1Label: string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          position: 'left' as const,
          title: { display: true, text: yLabel }
        },
        y1: {
          beginAtZero: true,
          position: 'right' as const,
          max: 10, // La nota máxima suele ser 10
          grid: { drawOnChartArea: false }, // No mezcla las líneas de cuadrícula
          title: { display: true, text: y1Label }
        }
      },
      plugins: {
        legend: { display: true, position: 'top' as const }
      }
    };
  }

}
