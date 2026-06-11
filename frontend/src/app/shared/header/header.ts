import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStethoscope, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Header {
  readonly icons = { faArrowRight, faStethoscope};
  authenticated = true;
}
