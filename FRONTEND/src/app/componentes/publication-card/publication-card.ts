import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PublicacionViewModel } from '../../core/models/publicacion.model';

@Component({
  selector: 'app-publication-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './publication-card.html',
  styleUrl: './publication-card.css'
})
export class PublicationCardComponent {
  readonly publication = input.required<PublicacionViewModel>();
}
