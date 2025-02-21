import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, UserCredentials, RegisterResponse } from '../models/user.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Charger l'utilisateur actuel si un token existe
    if (this.authService.getToken()) {
      this.loadCurrentUser();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Récupérer la liste des utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/`, {
      headers: this.getHeaders()
    });
  }

  // Récupérer un utilisateur par son ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Enregistrer un nouvel utilisateur
  register(credentials: UserCredentials): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register/`,
      credentials
    );
  }

  // Mettre à jour un utilisateur
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/${id}/`,
      userData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(updatedUser => {
        // Mettre à jour l'utilisateur actuel si c'est le même
        if (this.currentUserSubject.value?.id === id) {
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  // Charger l'utilisateur actuel
  private loadCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/me/`, {
      headers: this.getHeaders()
    }).subscribe(
      user => this.currentUserSubject.next(user),
      error => {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        this.authService.logout(); // Déconnexion si le token est invalide
      }
    );
  }

  // Obtenir l'utilisateur actuel de manière synchrone
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }



  // Rechercher des utilisateurs
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params: { q: query }
    });
  }

  // Supprimer un utilisateur (admin seulement)
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}/`,
      { headers: this.getHeaders() }
    );
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur s\'est produite:', error);
    // Vous pouvez ajouter ici une logique de gestion des erreurs plus sophistiquée
    throw error;
  }
}
