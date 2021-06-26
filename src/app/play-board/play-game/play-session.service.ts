import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  gameResults,
  Player,
  playerChance,
  Tile,
  winPatterns,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PlaySessionService {
  private _gameInProgress: boolean = false;
  private _chance: playerChance = playerChance.ONE;
  private _player1: Player = { tiles: [] };
  private _player2: Player = { tiles: [] };
  private _tiles: Tile[] = [];
  private boxes: number[] = [];
  private $gameDone: Subject<gameResults> = new Subject();

  get player1(): Player {
    return this._player1;
  }

  get player2(): Player {
    return this._player2;
  }

  get chance(): playerChance {
    return this._chance;
  }

  get gameInProgress() {
    return this._gameInProgress;
  }

  set gameInProgress(value) {
    this._gameInProgress = value;
  }

  public get tiles(): Tile[] {
    return this._tiles;
  }

  public set tiles(v: Tile[]) {
    this._tiles = v;
  }

  public gameDoneObservable(): Observable<gameResults> {
    return this.$gameDone.asObservable();
  }

  resetGame() {
    this._chance = playerChance.ONE;
    this._gameInProgress = false;
    this._tiles = [];
    this._player1 = { tiles: [] };
    this._player2 = { tiles: [] };
    this.boxes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  constructor() {}

  toggleTurn(tileNum: number) {
    this._gameInProgress = true;
    switch (this._chance) {
      case playerChance.ONE:
        this._player1.tiles.push(tileNum);
        this.checkBoard(tileNum);
        this._chance = playerChance.TWO;
        break;
      case playerChance.TWO:
        this._player2.tiles.push(tileNum);
        this.checkBoard(tileNum);
        this._chance = playerChance.ONE;
        break;
    }
  }

  private checkBoard(tileNum: number) {
    let currentPlayerArray: number[] = [];
    this.boxes = this.boxes.filter((box) => box !== tileNum);

    if (this._chance === playerChance.ONE) {
      this._player1.tiles.sort();
      currentPlayerArray = this._player1.tiles;
    } else {
      this._player2.tiles.sort();
      currentPlayerArray = this._player2.tiles;
    }

    const checkState = winPatterns.some((pattern) => {
      let retVal = true;
      pattern.forEach((num) => {
        if (!currentPlayerArray.includes(num)) {
          retVal = false;
        }
      });
      return retVal;
    });

    if (checkState) {
      this.$gameDone.next(
        this._chance === playerChance.ONE
          ? (playerChance.ONE as any)
          : (playerChance.TWO as any)
      );
    }

    // tied
    if (this.boxes.length === 0) {
      this.$gameDone.next(gameResults.TIED);
    }
  }
}
