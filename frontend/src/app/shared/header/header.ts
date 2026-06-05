import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ArrowRight, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, Stethoscope } from "lucide-angular";

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
      {
        provide: LUCIDE_ICONS,
        multi: true,
        useValue: new LucideIconProvider({ ArrowRight, Stethoscope })
      }
    ]
})
export class Header {
  readonly icons = { ArrowRight, Stethoscope};
}
