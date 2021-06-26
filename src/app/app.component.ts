import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaySessionService } from './play-board/play-game/play-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'tic-tac-toe';

  constructor(private readonly playSessionSvc: PlaySessionService) {}

  ngOnInit(): void {
    this.playSessionSvc.resetGame();
  }

  ngOnDestroy(): void {
    this.playSessionSvc.resetGame();
  }
}
