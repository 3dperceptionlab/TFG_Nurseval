import { Component } from '@angular/core';
import { ArrowRight, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, Stethoscope } from "lucide-angular";

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
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
