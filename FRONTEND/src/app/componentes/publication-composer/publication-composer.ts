import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PublicacionesService } from '../../core/services/publicaciones.service';

@Component({
  selector: 'app-publication-composer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './publication-composer.html',
  styleUrl: './publication-composer.css'
})
export class PublicationComposerComponent {
  private readonly service = inject(PublicacionesService);
  readonly content = signal('');
  readonly category = signal('E-commerce');
  readonly selectedImage = signal<File | null>(null);
  readonly previewUrl = signal('');
  readonly submitting = signal(false);
  readonly feedback = signal('');
  private previewObjectUrl = '';

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.clearPreview();
    if (!file) { this.selectedImage.set(null); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      this.feedback.set('Selecciona JPG, PNG o WEBP de máximo 5 MB.');
      input.value = '';
      this.selectedImage.set(null);
      return;
    }
    void this.prepareImage(file);
  }

  private async prepareImage(file: File): Promise<void> {
    try {
      const bitmap = await createImageBitmap(file);
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('No fue posible procesar la imagen.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(result => result ? resolve(result) : reject(new Error('No fue posible comprimir la imagen.')), 'image/webp', 0.82)
      );
      const optimized = new File([blob], `${file.name.replace(/\\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
      this.selectedImage.set(optimized);
      this.previewObjectUrl = URL.createObjectURL(optimized);
      this.previewUrl.set(this.previewObjectUrl);
      this.feedback.set(`Imagen optimizada: ${(file.size / 1024).toFixed(0)} KB → ${(optimized.size / 1024).toFixed(0)} KB.`);
    } catch {
      this.selectedImage.set(null);
      this.feedback.set('El navegador no pudo procesar la imagen. Prueba con otro archivo.');
    }
  }

  removeImage(): void { this.selectedImage.set(null); this.clearPreview(); }

  publish(): void {
    const content = this.content().trim();
    if (content.length < 10) { this.feedback.set('Describe tu experiencia con al menos 10 caracteres.'); return; }
    const body = new FormData();
    body.append('contenido', content);
    body.append('categoria', this.category());
    const image = this.selectedImage();
    if (image) body.append('imagen', image);
    this.submitting.set(true);
    this.feedback.set('');
    this.service.crearPublicacion(body).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.content.set('');
        this.category.set('E-commerce');
        this.selectedImage.set(null);
        this.clearPreview();
        this.feedback.set('¡Publicación creada! Actualiza el feed para verla.');
      },
      error: error => this.feedback.set(error?.error?.mensaje || 'No fue posible publicar. Comprueba tu sesión e inténtalo de nuevo.')
    });
  }

  private clearPreview(): void {
    if (this.previewObjectUrl) URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = '';
    this.previewUrl.set('');
  }
}
