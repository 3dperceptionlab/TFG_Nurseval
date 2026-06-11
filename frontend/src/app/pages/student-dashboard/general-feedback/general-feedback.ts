import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faPenToSquare} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-general-feedback',
  imports: [FontAwesomeModule],
  templateUrl: './general-feedback.html',
  styleUrl: './general-feedback.css',
})
export class GeneralFeedback {
  readonly icons = {faPen, faPenToSquare,};
}
