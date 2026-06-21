import { Component, computed, signal, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand} from '@fortawesome/free-solid-svg-icons';
import { VideoModal } from "./video-modal/video-modal";
import { Steps } from './steps/steps';
import { ProtocolService } from '../../services/protocol.service';
import { Protocol } from '../../models/protocolos-data';
@Component({
  selector: 'app-theory',
  imports: [FontAwesomeModule, VideoModal, Steps],
  templateUrl: './theory.html',
  styleUrl: './theory.css',
})
export class Theory {
  icons = {faImage, faLightbulb, faPlay, faXmark, faVideo, faExpand};

  protocolService = inject(ProtocolService);

  showVideoModal = signal(false);
  selectedKey = signal<string>('Capelina');
  protocols = computed<Protocol[]>(() => (this.protocolService.protocolsResource.value() as Protocol[]) ?? []);
  protocolkeys = computed(() => {
    return this.protocols().map(protocol => protocol.title);
  });
  
  currentProtocol = computed<Protocol | undefined>(() => {
    const all = this.protocols();
    if (all.length === 0) return undefined;

    const encontrado = all.find(p => p.title === this.selectedKey());
    return encontrado ?? all[0];
  });

  onSelectionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedKey.set(selectElement.value);
  }

}
