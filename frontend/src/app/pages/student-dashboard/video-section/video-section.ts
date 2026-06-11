import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPlay, faExpand, faVrCardboard, faHand, faFaceMeh, faStopwatch} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-video-section',
  imports: [FontAwesomeModule],
  templateUrl: './video-section.html',
  styleUrl: './video-section.css',
})
export class VideoSection {
  readonly icons = { faEye, faPlay, faExpand,  faVrCardboard, faHand, faFaceMeh, faStopwatch};

}
