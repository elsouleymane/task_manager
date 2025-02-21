import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Vérifier si l'utilisateur est authentifié
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Si non authentifié, rediriger vers la page de connexion
    // en sauvegardant l'URL demandée pour redirection après connexion
    return this.router.createUrlTree(
      ['/login'],
      { queryParams: { returnUrl: state.url }}
    );
  }
}
