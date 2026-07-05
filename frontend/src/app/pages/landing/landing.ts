import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faArrowRight, faBrain, faUserGraduate, faHandHoldingMedical, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Header } from "../../shared/header/header";
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  imports: [FontAwesomeModule, Header, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  readonly icons = { faUser, faArrowRight, faBrain, faUserGraduate, faHandHoldingMedical };

  authService = inject(Auth);
  private sanitizer = inject(DomSanitizer);

  demoVideoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://player.mediadelivery.net/play/695560/40b83402-d03c-45c0-b698-c4fcb9ae6443');

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

  scrollToVideo() {
    const videoSection = document.getElementById('demo-video');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
