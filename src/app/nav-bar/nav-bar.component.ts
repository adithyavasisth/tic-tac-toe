import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IsHandsetService } from './../is-handset/is-handset.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  public get isHandset$(): Observable<boolean> {
    return this.isHandsetService.isHandset$;
  }

  constructor(readonly isHandsetService: IsHandsetService) {}
}
