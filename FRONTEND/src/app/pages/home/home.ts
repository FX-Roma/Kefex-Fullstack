import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Publication {
  id: number;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  badgeRole: string;
  timeAgo: string;
  title: string;
  content: string;
  codeSnippet?: string;
  category: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  views: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface Creator {
  id: number;
  name: string;
  role: string;
  avatar: string;
  projectsCount: number;
  isFollowing: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  selectedTab = signal<'explore' | 'following' | 'trending'>('explore');

  publications = signal<Publication[]>([
    {
      id: 1,
      authorName: 'Alex Rivera',
      authorHandle: '@arivera_dev',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      badgeRole: 'Staff Frontend',
      timeAgo: 'Hace 45 min',
      title: 'Optimizando la renderización con Angular Signals y Zoneless Architecture',
      content: 'El futuro de Angular sin Zone.js ya está aquí. Implementamos una estrategia completa de reatividad fina para reducir el bundle final y disparar la tasa de cuadros por segundo a 120fps sostenidos.',
      codeSnippet: `// Señal derivada reactiva
readonly filteredProjects = computed(() => {
  return this.projects().filter(p => p.stars > 100);
});`,
      category: 'Architecture',
      tags: ['Angular', 'TypeScript', 'Performance'],
      likes: 142,
      commentsCount: 28,
      views: '1.8k'
    },
    {
      id: 2,
      authorName: 'Elena Rostova',
      authorHandle: '@erostova_ui',
      authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      badgeRole: 'UI/UX Lead',
      timeAgo: 'Hace 3 horas',
      title: 'Kefex Design System v2.0: Componentes de Cristal Neón',
      content: 'Presentamos la nueva librería de diseño para desarrolladores. Transparencia de capa adaptable, sombras volumétricas y compatibilidad nativa con CSS Container Queries.',
      category: 'Design Systems',
      tags: ['Design', 'CSSGrid', 'UIUX'],
      likes: 310,
      commentsCount: 45,
      views: '3.4k'
    }
  ]);

  topCreators = signal<Creator[]>([
    {
      id: 1,
      name: 'Carlos Mendoza',
      role: 'Full Stack Architect',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
      projectsCount: 24,
      isFollowing: false
    },
    {
      id: 2,
      name: 'Sofia Chen',
      role: 'WebGL & Shader Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      projectsCount: 18,
      isFollowing: true
    }
  ]);

  trendingTopics = ['#Angular18', '#WebAssembly', '#Tailwind4', '#RustDev', '#AIUI'];

  setTab(tab: 'explore' | 'following' | 'trending'): void {
    this.selectedTab.set(tab);
  }

  toggleLike(post: Publication): void {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
  }

  toggleFollow(creator: Creator): void {
    creator.isFollowing = !creator.isFollowing;
  }
}