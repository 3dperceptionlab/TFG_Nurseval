import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-video-modal',
  imports: [FontAwesomeModule],
  templateUrl: './video-modal.html',
  styleUrl: './video-modal.css',
})
export class VideoModal {
  icons = {faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand};

  currentProtocol = input<any>();
  showVideoModal = input<boolean>();
  closeEmit = output();

  closeModal() {
    this.closeEmit.emit();
  }
}
