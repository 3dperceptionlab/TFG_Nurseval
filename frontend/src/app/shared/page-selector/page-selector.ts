import { Component, computed, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-page-selector',
  imports: [FontAwesomeModule],
  templateUrl: './page-selector.html',
  styleUrl: './page-selector.css',
})
export class PageSelector {
  icons = {faAngleRight, faAngleLeft };

  actualPage = input.required<number>();
  totalElements = input.required<number>();
  elementsPerPage = input<number>(10);

  changePage = output<number>();

  totalPages = computed(() => {
    return Math.ceil(this.totalElements() / this.elementsPerPage());
  });

  pages = computed(() => {
    const listado = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      listado.push(i);
    }
    return listado;
  });

  goTo(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages() && pagina !== this.actualPage()) {
      this.changePage.emit(pagina);
    }
  }
}
