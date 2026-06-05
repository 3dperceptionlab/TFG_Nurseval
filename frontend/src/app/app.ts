
import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface TimelineEvent {
  time: number;
  type: string;
  label: string;
  detail: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
