import { Component, computed, effect, ElementRef, inject, input, OnDestroy, output, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPause, faVolumeMute, faVolumeUp, faPlay, faExpand, faVrCardboard, faHand, faFaceMeh, faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { TimeFormatPipe } from "../../../pipes/timeFormat.pipe";
import { isPlatformBrowser } from '@angular/common';
import { HololensData } from '../../../models/procedure.model';

type HololensFrame = NonNullable<HololensData['frames']>[number];

@Component({
  selector: 'app-video-section',
  imports: [FontAwesomeModule, TimeFormatPipe],
  templateUrl: './video-section.html',
  styleUrl: './video-section.css',
})
export class VideoSection implements OnDestroy {
  readonly icons = { faEye,faPause, faPlay, faExpand,  faVrCardboard, faHand, faFaceMeh, faStopwatch, faVolumeMute, faVolumeUp,};

  private platformId = inject(PLATFORM_ID);

  videoUrl = input<string | null>();
  seekTo = input<number | null>();
  hololens = input<HololensData>();
  // Activar/desactivar el dibujado de las manchas de mirada 
  gazeEnabled = input<boolean>(true);
  /**
   * Factor de calibración de la proyección de la mirada.
   * eyeTrackerDir es un vector 3D normalizado (dir.x, dir.y, dir.z, con -Z hacia delante).
   * Proyectamos con división de perspectiva: screenX = dir.x / -dir.z, screenY = dir.y / -dir.z.
   * gazeFovScale representa aproximadamente tan(FOV_horizontal / 2) de la cámara POV.
   */
  gazeFovScale = input<number>(2.2);
  //Radio de la mancha de mirada en píxeles de canvas 
  gazeRadius = input<number>(45);
  //Color base de la mancha
  gazeColor = input<string>('202, 53, 0'); 
  //Cuánto tiempo (ms) permanece visible el rastro de puntos anteriores, para dar efecto de mancha/estela 
  gazeTrailMs = input<number>(500);

  timeUpdate = output<number>();
  durationChange = output<number>();

  videoContainer = viewChild<ElementRef<HTMLDivElement>>('videoContainer');
  videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('gazeCanvas');

  // --- Estado interno del overlay de las manchas 
  private ctx: CanvasRenderingContext2D | null = null;
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private gazeTrail: { x: number; y: number; t: number }[] = [];

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

    const sortedFrames = [...data.frames].sort((a, b) => a.time - b.time);

    for (let i = sortedFrames.length - 1; i >= 0; i--) {
      if (sortedFrames[i].time <= this.currentTime()) {
        return sortedFrames[i];
      }
    }

    return sortedFrames[0];
  });

  constructor() {
    effect(() => {
      const videoEl = this.videoRef()?.nativeElement;
      const targetTime = this.seekTo();

      if (videoEl && targetTime !== null && targetTime !== undefined) {
        videoEl.currentTime = targetTime;
      }
    });

    // Inicializa el canvas de overlay en cuanto video + canvas existen en el DOM
    effect(() => {
      const video = this.videoRef()?.nativeElement;
      const canvas = this.canvasRef()?.nativeElement;
      if (!this.isBrowser() || !video || !canvas || this.ctx) return;

      this.initOverlay(canvas);
      this.startRenderLoop();
    });
  }

  ngOnDestroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }

  onLoadedMetadata() {
    const video = this.videoRef()?.nativeElement;
    if (video) {
      this.duration.set(video.duration);
      this.durationChange.emit(video.duration);
      this.resizeCanvas();
    }
  }

  //  OVERLAY DE GAZE: init, proyección, render loop

  private initOverlay(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(canvas);
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Proyecta el vector de dirección de mirada 3D sobre el plano de la imagen 2D.
   * Devuelve coordenadas normalizadas [0,1]x[0,1] (0,0 = esquina superior izquierda),
   * o null si no hay datos de mirada para ese frame.
   */
  private projectGaze(frame: HololensFrame): { x: number; y: number } | null {
    const dir = frame.eyeTrackerDir;
    if (!dir || dir.z === 0) return null;

    // División de perspectiva: -dir.z es la componente delante
    const projX = dir.x / -dir.z;
    const projY = dir.y / -dir.z;

    const fov = this.gazeFovScale();
    const nx = 0.5 + (projX / fov) * 0.5;
    const ny = 0.5 - (projY / fov) * 0.5; // invertido: Y positivo suele ser arriba

    return {
      x: Math.min(1, Math.max(0, nx)),
      y: Math.min(1, Math.max(0, ny)),
    };
  }

  // Busca el frame de telemetría más cercano a un instante concreto 
  private findFrameAtTime(time: number): HololensFrame | null {
    const data = this.hololens();
    if (!data || !data.frames || data.frames.length === 0) return null;

    const frames = data.frames;
    for (let i = frames.length - 1; i >= 0; i--) {
      if (frames[i].time <= time) return frames[i];
    }
    return frames[0];
  }

  private renderFrame() {
    const ctx = this.ctx;
    const video = this.videoRef()?.nativeElement;
    const canvas = this.canvasRef()?.nativeElement;
    if (!ctx || !video || !canvas) return;

    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (!this.gazeEnabled()) return;

    const frame = this.findFrameAtTime(video.currentTime);
    if (frame) {
      const proj = this.projectGaze(frame);
      if (proj) {
        this.gazeTrail.push({ x: proj.x * cssWidth, y: proj.y * cssHeight, t: performance.now() });
      }
    }

    // Purga puntos antiguos y dibuja el rastro
    const now = performance.now();
    const trailMs = this.gazeTrailMs();
    this.gazeTrail = this.gazeTrail.filter(p => now - p.t <= trailMs);

    const radius = this.gazeRadius();
    const rgb = this.gazeColor();

    for (const point of this.gazeTrail) {
      const age = (now - point.t) / trailMs; // 0 = recién puesto, 1 = a punto de desaparecer
      const alpha = 0.6 - age;

      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      gradient.addColorStop(0, `rgba(${rgb}, ${0.1 * alpha})`);
      gradient.addColorStop(0.6, `rgba(${rgb}, ${0.1 * alpha})`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private startRenderLoop() {
    const loop = () => {
      this.renderFrame();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  //  CONTROLES DE REPRODUCCIÓN

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