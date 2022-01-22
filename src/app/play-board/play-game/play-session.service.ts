import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  GameResults,
  Player,
  PlayerChance,
  Tile,
  WinPatterns
} from '../models';

/**
 * @description Handles the Game Session that is being played
 */
@Injectable({
  providedIn: 'root',
})
export class PlaySessionService {
  private _gameInProgress: boolean = false;
  private _chance: PlayerChance = PlayerChance.ONE;
  private _player1: Player = { name: '', tiles: [], timesWon: 0 };
  private _player2: Player = { name: '', tiles: [], timesWon: 0 };
  private _tiles: Tile[] = [];
  private boxes: number[] = [];
  private $gameResult: Subject<GameResults> = new Subject();

  /**
   * @description Returns Player 1 Data
   * @readonly
   */
  get player1(): Player {
    return this._player1;
  }

  /**
   * @description Returns Player 2 Data
   * @readonly
   */
  get player2(): Player {
    return this._player2;
  }

  /**
   * @description Returns Player 1 Name
   */
  get player1Name(): string {
    return this.player1.name;
  }

  /**
   * @description Sets Player 1 Name
   */
  set player1Name(name: string) {
    this.player1.name = name;
  }

  /**
   * @description Returns Player 2 Name
   */
  get player2Name(): string {
    return this.player2.name;
  }

  /**
   * @description Sets Player 2 Name
   */
  set player2Name(name: string) {
    this.player2.name = name;
  }

  /**
   * @description Returns number of times Player 1 has won
   */
  public get player1TimesWon(): number {
    return this.player1.timesWon ?? 0;
  }

  /**
   * @description Sets the number of times Player 1 has won
   */
  public set player1TimesWon(value: number) {
    this.player1.timesWon = value;
  }

  /**
   * @description Returns number of times Player 2 has won
   */
  public get player2TimesWon(): number {
    return this.player2.timesWon ?? 0;
  }

  /**
   * @description Sets the number of times Player 2 has won
   */
  public set player2TimesWon(value: number) {
    this.player2.timesWon = value;
  }

  /**
   * @description Returns the player number who's turn it is
   * @readonly
   */
  get chance(): PlayerChance {
    return this._chance;
  }

  /**
   * @description Returns if the game is in progress or not
   */
  get gameInProgress(): boolean {
    return this._gameInProgress;
  }

  /**
   * @description Sets if the game is in progress or not
   */
  set gameInProgress(value) {
    this._gameInProgress = value;
  }

  /**
   * @description Returns the tiles on the screen
   */
  public get tiles(): Tile[] {
    return this._tiles;
  }

  /**
   * @description Sets the value of the tiles
   */
  public set tiles(v: Tile[]) {
    this._tiles = v;
  }

  /**
   * @description Returns the observable of the game result
   */
  public gameResultObservable(): Observable<GameResults> {
    return this.$gameResult.asObservable();
  }

  /**
   * @description Sets the current turn to Player 1
   */
  public resetChance() {
    this._chance = PlayerChance.ONE;
  }

  /**
   * @description Handles the logic done to reset the game
   */
  resetGame() {
    this._gameInProgress = false;
    this._tiles = [];
    this.player1.tiles = [];
    this.player2.tiles = [];
    this.boxes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  constructor() {}

  /**
   * @description Toggles the player chance based on who's playing
   */
  public togglePlayer() {
    switch (this._chance) {
      case PlayerChance.ONE:
        this._chance = PlayerChance.TWO;
        break;
      case PlayerChance.TWO:
        this._chance = PlayerChance.ONE;
        break;
    }
  }

  /**
   * @description Handles the logic while changing the turn of each player
   */
  toggleTurn(tileNum: number) {
    this._gameInProgress = true;
    switch (this._chance) {
      case PlayerChance.ONE:
        this.player1.tiles.push(tileNum);
        this.checkBoard(tileNum);
        break;
      case PlayerChance.TWO:
        this.player2.tiles.push(tileNum);
        this.checkBoard(tileNum);
        break;
    }
  }

  /**
   * @description Checks if somebody has won the game or if the game got tied on each turn
   * @private
   */
  private checkBoard(tileNum: number) {
    let currentPlayerArray: number[] = [];
    this.boxes = this.boxes.filter((box) => box !== tileNum);

    if (this._chance === PlayerChance.ONE) {
      this.player1.tiles.sort();
      currentPlayerArray = this.player1.tiles;
    } else {
      this.player2.tiles.sort();
      currentPlayerArray = this.player2.tiles;
    }

    const checkState = WinPatterns.some((pattern) => {
      let retVal = true;
      pattern.forEach((num) => {
        if (!currentPlayerArray.includes(num)) {
          retVal = false;
        }
      });
      return retVal;
    });

    // win
    if (checkState) {
      if (this._chance === PlayerChance.ONE) {
        this.player1TimesWon += 1;
        this.$gameResult.next(GameResults.ONE);
      } else {
        this.player2TimesWon += 1;
        this.$gameResult.next(GameResults.TWO);
      }
      return;
    }

    // tied
    if (this.boxes.length === 0) {
      this.$gameResult.next(GameResults.TIED);
      return;
    }

    this.togglePlayer();
  }
}
