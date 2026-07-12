import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
// Convierte el tiempo en segundos a formato hh:mm:ss o mm:ss
export class TimeFormatPipe implements PipeTransform {
  transform(totalSeconds: number | null | undefined): string {
    if (totalSeconds == null || isNaN(totalSeconds)) return '00:00';

    const seconds = Math.floor(totalSeconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Asegura que todos los números tengan siempre dos dígitos
    const pad = (n: number) => n.toString().padStart(2, '0');

    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
      : `${pad(minutes)}:${pad(secs)}`;
  }
}