import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../enviroments/enviroment';
interface CartItem { _id?: string; producto?: { name?: string; nombre?: string; price?: number; precio?: number }; cantidad?: number; subtotal?: number; }
interface CartResponse { productos?: CartItem[]; items?: CartItem[]; total?: number; }
@Component({ selector: 'app-carrito', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './carrito.html', styleUrls: ['./carrito.css'] })
export class CarritoComponent {
  private readonly http = inject(HttpClient); private readonly auth = inject(AuthService); readonly items = signal<CartItem[]>([]); readonly loading = signal(true); readonly message = signal(''); readonly userId = signal('');
  constructor() { const user = this.auth.currentUser(); if (user?.id) { this.userId.set(user.id); this.load(); } else { this.loading.set(false); } }
  load(): void { this.loading.set(true); this.http.get<CartResponse>(`${environment.apiUrl}/carrito/${this.userId()}`).subscribe({ next: response => { this.items.set(response.productos ?? response.items ?? []); this.loading.set(false); }, error: () => { this.message.set('No fue posible recuperar el carrito. Comprueba la conexión con la API.'); this.loading.set(false); } }); }
  get total(): number { return this.items().reduce((sum, item) => sum + (item.producto?.price ?? item.producto?.precio ?? 0) * (item.cantidad ?? 1), 0); }
  updateQuantity(item: CartItem, delta: number): void { if (!item._id) return; const cantidad = Math.max(1, (item.cantidad || 1) + delta); this.http.put<{ carrito?: CartResponse }>(`${environment.apiUrl}/carrito/${this.userId()}/items/${item._id}`, { cantidad }).subscribe({ next: response => { this.items.set(response.carrito?.productos ?? this.items().map(current => current._id === item._id ? { ...current, cantidad } : current)); this.message.set('Cantidad actualizada.'); }, error: err => this.message.set(err.error?.mensaje || 'No fue posible actualizar la cantidad.') }); }
  removeItem(item: CartItem): void { if (!item._id) return; this.http.delete<{ carrito?: CartResponse }>(`${environment.apiUrl}/carrito/${this.userId()}/items/${item._id}`).subscribe({ next: response => { this.items.set(response.carrito?.productos ?? this.items().filter(current => current._id !== item._id)); this.message.set('Producto eliminado del carrito.'); }, error: err => this.message.set(err.error?.mensaje || 'No fue posible eliminar el producto.') }); }
  clear(): void { this.http.delete(`${environment.apiUrl}/carrito/${this.userId()}`).subscribe({ next: () => { this.items.set([]); this.message.set('Carrito vaciado.'); }, error: () => this.message.set('No fue posible vaciar el carrito.') }); }
  simulateCheckout(): void { if (!this.items().length) { this.message.set('Añade al menos un producto antes de simular el checkout.'); return; } this.message.set('Simulación completada: no se procesó ningún pago ni se creó un pedido real.'); }
}
