import { Component, ViewChild } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { IsHandsetService } from './../is-handset/is-handset.service';

/**
 * @description The Navigation Menu Component
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;

  /**
   * @description Returns if the screen is a mobile device or not
   */
  public get isHandset$(): Observable<boolean> {
    return this.isHandsetService.isHandset$;
  }

  constructor(readonly isHandsetService: IsHandsetService) {}

  /**
   * @description Close the sidenav menu on click if it is a mobile device
   */
  public close() {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        this.sidenavContainer.close();
      }
    });
  }
}
