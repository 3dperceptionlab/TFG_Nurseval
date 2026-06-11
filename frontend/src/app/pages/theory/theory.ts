import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { PROTOCOLOS_DATA } from '../../models/protocolos-data';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand} from '@fortawesome/free-solid-svg-icons';
import { VideoModal } from "./video-modal/video-modal";
import { Steps } from './steps/steps';

@Component({
  selector: 'app-theory',
  imports: [FontAwesomeModule, VideoModal, Steps],
  templateUrl: './theory.html',
  styleUrl: './theory.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Theory {
    icons = {faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand};
    showVideoModal = signal(false);
    PROTOCOLOS_DATA = PROTOCOLOS_DATA;
    protocolKeys = Object.keys(PROTOCOLOS_DATA);
    selectedKey = signal<string>('capelina');
    currentProtocol = computed(() => this.PROTOCOLOS_DATA[this.selectedKey()]);

    onSelectionChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedKey.set(selectElement.value);
    }

    
}
