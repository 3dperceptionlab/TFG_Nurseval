import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand} from '@fortawesome/free-solid-svg-icons';
import { Protocol } from '../../../models/protocols.model';

@Component({
  selector: 'app-steps',
  imports: [FontAwesomeModule],
  templateUrl: './steps.html',
  styleUrl: './steps.css',
})
export class Steps {
  icons = {faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand};

  currentProtocol = input<Protocol>();
  openModal = output();

  emitOpenModal() {
    this.openModal.emit();
  }
}
