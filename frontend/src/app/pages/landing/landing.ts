import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faArrowRight, faBrain, faUserGraduate, faHandHoldingMedical, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Header } from "../../shared/header/header";

@Component({
  selector: 'app-landing',
  imports: [FontAwesomeModule, Header],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
    readonly icons = { faUser, faArrowRight, faBrain, faUserGraduate, faHandHoldingMedical };

  features = [
    {
      title: 'Prácticas reales',
      description: 'Realiza procedimientos clínicos observando al paciente real. La Realidad Mixta respeta el procedimiento clásico.',
      icon: faUserDoctor
    },
    {
      title: 'Evaluación Inteligente',
      description: 'Análisis automático de la posición de las manos y ojos del vendaje a sensores avanzados.',
      icon: faBrain
    },
    {
      title: 'Autoaprendizaje',
      description: 'Revisa tus ejecuciones una y otra vez, cuando quieras y donde quieras. Observa tu áreas de mejora y tu evolución.',
      icon: faUserGraduate
    }
  ];
}
