import { Component, ChangeDetectionStrategy } from '@angular/core';
import { 
  ArrowRight, 
  Brain, 
  Monitor, 
  ShieldCheck, 
  Zap, 
  Stethoscope,
  LucideAngularModule, 
  LUCIDE_ICONS,
  LucideIconProvider 
} from 'lucide-angular';
import { Header } from "../../shared/header/header";

@Component({
  selector: 'app-landing',
  imports: [LucideAngularModule, Header],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Stethoscope, ShieldCheck, Zap, Monitor, Brain, ArrowRight })
    }
  ]
})
export class Landing {
    readonly icons = { ShieldCheck, Zap, Monitor, Brain, ArrowRight,Stethoscope };

  features = [
    {
      title: 'Prácticas reales',
      description: 'Realiza procedimientos clínicos observando al paciente real. La Realidad Mixta respeta el procedimiento clásico.',
      icon: 'Monitor'
    },
    {
      title: 'Evaluación Inteligente',
      description: 'Análisis automático de la posición de las manos y ojos del vendaje a sensores avanzados.',
      icon: 'Brain'
    },
    {
      title: 'Autoaprendizaje',
      description: 'Revisa tus ejecuciones una y otra vez, cuando quieras y donde quieras. Observa tu áreas de mejora y tu evolución.',
      icon: 'ShieldCheck'
    }
  ];
}
