import { Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  private sanitizer = inject(DomSanitizer);

  videoUrl = computed(() => {
    const videoId = this.currentProtocol().video; 
    const libraryId = "695560"; 
    const url = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  closeModal() {
    this.closeEmit.emit();
  }
}
