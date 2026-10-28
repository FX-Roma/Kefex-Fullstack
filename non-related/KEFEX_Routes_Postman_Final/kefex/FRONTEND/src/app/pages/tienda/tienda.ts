import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../enviroments/enviroment';
interface StoreProduct { _id?: string; id?: string | number; nombre?: string; name?: string; descripcion?: string; description?: string; precio?: number; price?: number; categoria?: string; imagen?: string; image?: string; }
@Component({ selector: 'app-tienda', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './tienda.html', styleUrls: ['./tienda.css'] })
export class TiendaComponent {
  private readonly http = inject(HttpClient); private readonly auth = inject(AuthService); private readonly router = inject(Router); readonly products = signal<StoreProduct[]>([]); readonly loading = signal(true); readonly apiAvailable = signal(true); readonly message = signal('');
  constructor() { this.loadProducts(); }
  loadProducts(): void { this.loading.set(true); this.http.get<StoreProduct[] | { productos?: StoreProduct[] }>(`${environment.apiUrl}/productos`).subscribe({ next: result => { this.products.set(Array.isArray(result) ? result : result.productos ?? []); this.loading.set(false); }, error: () => { this.apiAvailable.set(false); this.products.set([{ id: 'demo-1', name: 'KEFEX Starter Pack', description: 'Producto de muestra para validar la experiencia de tienda.', price: 0, categoria: 'Destacado' }, { id: 'demo-2', name: 'Community Pick', description: 'Los productos reales aparecerán al conectar el catálogo.', price: 0, categoria: 'Comunidad' }]); this.loading.set(false); } }); }
  addToCart(product: StoreProduct): void {
    if (!this.auth.isAuthenticated()) { this.message.set('Inicia sesión para agregar artículos al carrito.'); this.router.navigate(['/login'], { queryParams: { returnUrl: '/tienda' } }); return; }
    if (!this.apiAvailable()) { this.message.set('El catálogo real aún no está disponible. Los artículos de muestra no se envían al checkout.'); return; }
    const productId = product._id || product.id;
    if (!productId || String(productId).startsWith('demo-')) { this.message.set('Este artículo es de demostración y no se puede añadir.'); return; }
    this.http.post(`${environment.apiUrl}/carrito/items`, { productoId: productId, cantidad: 1 }).subscribe({ next: () => this.message.set(`${this.name(product)} se añadió al carrito.`), error: err => this.message.set(err.error?.mensaje || 'No fue posible añadir el producto al carrito.') });
  }
  name(product: StoreProduct): string { return product.name || product.nombre || 'Producto KEFEX'; }
  description(product: StoreProduct): string { return product.description || product.descripcion || 'Descubre los detalles de este producto.'; }
  price(product: StoreProduct): number { return product.price ?? product.precio ?? 0; }
}
