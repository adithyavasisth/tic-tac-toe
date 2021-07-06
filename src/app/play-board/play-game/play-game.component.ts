import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { IsHandsetService } from 'src/app/is-handset/is-handset.service';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';
import { GameResults, PlayerChance, Tile } from '../models';
import { PlaySessionService } from './play-session.service';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
})
export class PlayGameComponent implements OnInit, OnDestroy {
  private sub: Subscription = undefined as any;
  public message = '';
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
    this.sub = this.playSessionSvc.gameDoneObservable().subscribe((player) => {
      this.openDialog(player);
    });
  }

  private initTiles() {
    for (let tile = 0; tile < 9; tile++) {
      this.tiles.push({ color: '#7B1FA2', tileNum: tile, tileClass: [] });
    }
  }

  public resetGame() {
    this.message = '';
    this.playSessionSvc.resetGame();
    this.initTiles();
  }

  public newGame() {
    this.resetGame();
    this.playSessionSvc.gameInProgress = true;
  }

  public clickCell(tile: Tile) {
    if (this.playSessionSvc.gameInProgress && tile.tileClass.length === 0) {
      this.setIcon(this.playSessionSvc.chance, tile);
      this.playSessionSvc.toggleTurn(tile.tileNum);
    }
  }

  private setIcon(player: PlayerChance, tile: Tile) {
    const classArray = ['mdi'];
    if (player === PlayerChance.ONE) {
      classArray.push('mdi-close');
    } else {
      classArray.push('mdi-checkbox-blank-circle-outline');
    }
    tile.tileClass = classArray;
  }

  private openDialog(player: GameResults) {
    const playerName =
      player === GameResults.ONE
        ? this.playSessionSvc.player1Name
        : player === GameResults.TWO
        ? this.playSessionSvc.player2Name
        : GameResults.TIED;

    const dialogRef = this.dialog.open(GameOverDialogComponent, {
      data: { result: playerName },
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.newGame();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
