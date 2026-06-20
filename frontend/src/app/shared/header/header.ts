import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStethoscope, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Header {
  readonly icons = { faArrowRight, faStethoscope};

  authService = inject(Auth);

}
