import { Component, effect, inject, input, model, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { Auth } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-feedback',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './general-feedback.html',
  styleUrl: './general-feedback.css',
})
export class GeneralFeedback {
  readonly icons = {faPen, faPenToSquare,};

  authService = inject(Auth);

  comment = model<string>('');
  professorName = input<string>();
  procedureComment = input<string>();
  
}
