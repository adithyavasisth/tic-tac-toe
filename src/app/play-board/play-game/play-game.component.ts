import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { IsHandsetService } from 'src/app/is-handset/is-handset.service';
import { GameResultDialogComponent } from '../game-result-dialog/game-result-dialog.component';
import { GameResults, PlayerChance, Tile } from '../models';
import { PlaySessionService } from './play-session.service';

/**
 * @description The Component which displays the board and allows game play
 */
@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
})
export class PlayGameComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  constructor(
    readonly isHandsetService: IsHandsetService,
    readonly playSessionSvc: PlaySessionService,
    private readonly dialog: MatDialog
  ) {}

  /**
   * @description Returns if the screen is a mobile device or not
   */
  public get isHandset$(): Observable<boolean> {
    return this.isHandsetService.isHandset$;
  }

  /**
   * @description Returns the tiles on the screen
   * @readonly
   */
  public get tiles(): Tile[] {
    return this.playSessionSvc.tiles;
  }

  ngOnInit(): void {
    if (!this.playSessionSvc.gameInProgress) {
      this.newGame();
      this.playSessionSvc.resetChance();
    }
    this.sub = this.playSessionSvc
      .gameResultObservable()
      .subscribe((player) => {
        this.openDialog(player);
      });
  }

  /**
   * @description Initializes the tiles with default data
   * @private
   */
  private initTiles() {
    for (let tile = 0; tile < 9; tile++) {
      this.tiles.push({ color: '#7B1FA2', tileNum: tile, tileClass: [] });
    }
  }

  /**
   * @description Resets the game, message and tiles
   */
  public resetGame() {
    this.playSessionSvc.resetGame();
    this.initTiles();
  }

  /**
   * @description Creates a new game
   */
  public newGame() {
    this.resetGame();
    this.playSessionSvc.gameInProgress = true;
    this.playSessionSvc.togglePlayer();
  }

  /**
   * @description Handles click on cell
   */
  public clickCell(tile: Tile) {
    if (this.playSessionSvc.gameInProgress && tile.tileClass.length === 0) {
      this.setIcon(this.playSessionSvc.chance, tile);
      this.playSessionSvc.toggleTurn(tile.tileNum);
    }
  }

  /**
   * @description Set the icon on tiles based on the player who clicked it
   * @private
   */
  private setIcon(player: PlayerChance, tile: Tile) {
    const classArray = ['mdi'];
    if (player === PlayerChance.ONE) {
      classArray.push('mdi-close');
    } else {
      classArray.push('mdi-checkbox-blank-circle-outline');
    }
    tile.tileClass = classArray;
  }

  /**
   * @description Creates and calls the Game Over Dialog Component based on the game result
   * @private
   */
  private openDialog(player: GameResults) {
    const playerName =
      player === GameResults.ONE
        ? this.playSessionSvc.player1Name
        : player === GameResults.TWO
        ? this.playSessionSvc.player2Name
        : GameResults.TIED;

    const dialogRef = this.dialog.open(GameResultDialogComponent, {
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
