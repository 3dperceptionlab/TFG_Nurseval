import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { 
  ArrowRight, 
  Scissors,
  CircleCheck,
  ChevronDown,
  Search,
  Lightbulb,
  LucideAngularModule, 
  LUCIDE_ICONS,
  LucideIconProvider,
  Image 
} from 'lucide-angular';
import { PROTOCOLOS_DATA } from '../../models/protocolos-data';

@Component({
  selector: 'app-theory',
  imports: [LucideAngularModule],
  templateUrl: './theory.html',
  styleUrl: './theory.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
        provide: LUCIDE_ICONS,
        multi: true,
        useValue: new LucideIconProvider({ ArrowRight, Scissors, CircleCheck, Image, ChevronDown,Search,Lightbulb   })
    }
  ]
  
})
export class Theory {
    PROTOCOLOS_DATA = PROTOCOLOS_DATA;
    protocolKeys = Object.keys(PROTOCOLOS_DATA);
    selectedKey = signal<string>('capelina');
    currentProtocol = computed(() => this.PROTOCOLOS_DATA[this.selectedKey()]);

    onSelectionChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedKey.set(selectElement.value);
    }
}
