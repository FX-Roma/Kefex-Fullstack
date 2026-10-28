export interface Credential { username: string; password: string; }
export interface AuthResponse { result: 'fine' | 'mal'; message: string; data?: string; user?: { id: string; name: string; email: string; rol: 'user' | 'admin'; }; }
export interface DecodedToken { id: string; name?: string; nombre?: string; email?: string; username?: string; avatarUrl?: string; avatar?: string; biografia?: string; rol?: 'user' | 'admin'; iat?: number; exp?: number; [key: string]: unknown; }
