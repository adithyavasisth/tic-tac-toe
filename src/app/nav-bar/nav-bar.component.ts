import { Component, ViewChild } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { IsHandsetService } from './../is-handset/is-handset.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;

  public get isHandset$(): Observable<boolean> {
    return this.isHandsetService.isHandset$;
  }

  public close() {
    this.sidenavContainer.close();
  }

  constructor(readonly isHandsetService: IsHandsetService) {}
}
