import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { PlaySessionService } from './play-session.service';

@Injectable({ providedIn: 'root' })
export class CanPlayGuard implements CanActivate {
  constructor(
    private readonly playSessionSvc: PlaySessionService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.playSessionSvc.player1Name && !this.playSessionSvc.player2Name) {
      this.snackBar.open('Enter the names please!', undefined, {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
