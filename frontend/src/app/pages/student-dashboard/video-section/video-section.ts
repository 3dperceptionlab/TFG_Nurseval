import { afterNextRender, Component, computed, effect, ElementRef, inject, input, output, PLATFORM_ID, signal, viewChild, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPause, faVolumeMute, faVolumeUp, faPlay, faExpand, faVrCardboard, faHand, faFaceMeh, faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { TimeFormatPipe } from "../../../pipes/timeFormat.pipe";
import { isPlatformBrowser } from '@angular/common';
import { HololensData } from '../../../models/procedure.model';

@Component({
  selector: 'app-video-section',
  imports: [FontAwesomeModule, TimeFormatPipe],
  templateUrl: './video-section.html',
  styleUrl: './video-section.css',
})
export class VideoSection {
  readonly icons = { faEye,faPause, faPlay, faExpand,  faVrCardboard, faHand, faFaceMeh, faStopwatch, faVolumeMute, faVolumeUp,};
  videoUrl = input<string>();
  seekTo = input<number | null>();
  hololens = input<HololensData>();

  timeUpdate = output<number>();

  private platformId = inject(PLATFORM_ID);

  videoContainer = viewChild<ElementRef<HTMLDivElement>>('videoContainer');
  videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');

  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  progressPercent = signal(0);
  volume = signal(1); 
  isMuted = signal(false);
  isBrowser = signal(isPlatformBrowser(this.platformId));

  currentFrame = computed(() => {
    const data = this.hololens();
    if (!data || !data.frames || data.frames.length === 0) return null;

    const frames = data.frames;

    for (let i = frames.length - 1; i >= 0; i--) {
      if (frames[i].time <= this.currentTime()) {
        return frames[i];
      }
    }

    return frames[0];
  });

  constructor() {
    effect(() => {
      const videoEl = this.videoRef()?.nativeElement;
      const targetTime = this.seekTo();

      if (videoEl && targetTime !== null && targetTime !== undefined) {
        videoEl.currentTime = targetTime;
      }
    });
  }

  onLoadedMetadata() {
    const video = this.videoRef()?.nativeElement;
    if (video) {
      this.duration.set(video.duration);
    }
  }

  onTimeUpdate() {
    const video = this.videoRef()?.nativeElement;
    if (!video) return;
    
    const time = video.currentTime;
    this.currentTime.set(time);
    this.progressPercent.set(this.duration() ? (time / this.duration()) * 100 : 0);
    this.timeUpdate.emit(time);
  }

  onPlay() { this.isPlaying.set(true); }
  onPause() { this.isPlaying.set(false); }

  togglePlay() {
    const video = this.videoRef()?.nativeElement;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => console.warn('Error al reproducir:', err));
    } else {
      video.pause();
    }
  }

  toggleMute() {
    const video = this.videoRef()?.nativeElement;
    if (!video) return;
    video.muted = !video.muted;
    this.isMuted.set(video.muted);
  }

  onVolumeChange(event: Event) {
    const video = this.videoRef()?.nativeElement;
    const input = event.target as HTMLInputElement;
    if (!video) return;
    
    const value = parseFloat(input.value);
    video.volume = value;
    this.volume.set(value);
    this.isMuted.set(value === 0);
  }

  toggleFullscreen() {
    const container = this.videoContainer()?.nativeElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error intentando activar pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  onProgressClick(event: MouseEvent) {
    const video = this.videoRef()?.nativeElement;
    if (!video || !this.duration()) return;
    
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    video.currentTime = percentage * this.duration();
  }
}