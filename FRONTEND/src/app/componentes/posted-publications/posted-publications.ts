import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { PublicacionViewModel } from '../../core/models/publicacion.model';

@Component({
  selector: 'app-posted-publications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posted-publications.html',
  styleUrl: './posted-publications.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostedPublications implements OnInit {
  private readonly router = inject(Router);
  private readonly publicacionesService = inject(PublicacionesService);

  readonly publicacionesEcologicos = signal<PublicacionViewModel[]>([]);
  readonly publicacionesSombrillas = signal<PublicacionViewModel[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.cargarSecciones();
  }

  cargarSecciones(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.publicacionesService.obtenerPublicaciones({ limit: 50 })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: publications => {
          this.publicacionesEcologicos.set(publications.filter(item => this.normalizeCategory(item.categoria) === 'ecologicos'));
          this.publicacionesSombrillas.set(publications.filter(item => this.normalizeCategory(item.categoria) === 'sombrillas'));
        },
        error: error => {
          console.error('Unable to load KEFEX publications.', error);
          this.errorMessage.set('No fue posible cargar las publicaciones. Comprueba tu conexión e inténtalo de nuevo.');
        }
      });
  }

  abrirPublicacion(publicacion: PublicacionViewModel): void {
    if (!publicacion.id) return;
    this.router.navigate(['/publicaciones', publicacion.id]);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  trackById(_index: number, publication: PublicacionViewModel): string {
    return String(publication.id);
  }

  private normalizeCategory(category: string): string {
    return category.trim().toLocaleLowerCase();
  }
}
