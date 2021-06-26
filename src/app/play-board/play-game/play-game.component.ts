import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { IsHandsetService } from 'src/app/is-handset/is-handset.service';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';
import { PlaySessionService, Tile } from './play-session.service';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
})
export class PlayGameComponent implements OnInit {
  message = '';
  constructor(
    readonly isHandsetService: IsHandsetService,
    readonly playSessionSvc: PlaySessionService,
    private readonly dialog: MatDialog
  ) {}

  public get isHandset$(): Observable<boolean> {
    return this.isHandsetService.isHandset$;
  }

  public get tiles(): Tile[] {
    return this.playSessionSvc.tiles;
  }

  ngOnInit(): void {
    if (!this.playSessionSvc.gameInProgress) {
      this.newGame();
    }
  }

  private initTiles() {
    for (let tile = 0; tile < 9; tile++) {
      this.tiles.push({ color: '#7B1FA2', tileNum: tile, tileClass: [] });
    }
  }

  resetGame() {
    this.message = '';
    this.playSessionSvc.resetGame();
    this.initTiles();
  }

  newGame() {
    this.resetGame();
    this.playSessionSvc.gameInProgress = true;
    this.playSessionSvc
      .gameDoneObservable()
      .pipe(take(1))
      .subscribe((player) => {
        this.openDialog(player);
      });
  }

  clickCell(tile: Tile) {
    if (this.playSessionSvc.gameInProgress && tile.tileClass.length === 0) {
      this.setIcon(this.playSessionSvc.chance, tile);
      this.playSessionSvc.toggleTurn(tile.tileNum);
    }
  }

  private setIcon(player: 1 | 2, tile: Tile) {
    const classArray = ['mdi'];
    if (player === 1) {
      classArray.push('mdi-close');
    } else {
      classArray.push('mdi-checkbox-blank-circle-outline');
    }
    tile.tileClass = classArray;
  }

  private openDialog(player: 1 | 2 | 'tied') {
    const dialogRef = this.dialog.open(GameOverDialogComponent, {
      data: { result: player },
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.resetGame();
    });
  }
}
