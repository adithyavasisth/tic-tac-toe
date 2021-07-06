import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  GameResults,
  Player,
  PlayerChance,
  Tile,
  WinPatterns,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PlaySessionService {
  private _gameInProgress: boolean = false;
  private _chance: PlayerChance = PlayerChance.ONE;
  private _player1: Player = { tiles: [] };
  private _player2: Player = { tiles: [] };
  private _tiles: Tile[] = [];
  private boxes: number[] = [];
  private $gameDone: Subject<GameResults> = new Subject();

  get player1(): Player {
    return this._player1;
  }

  get player2(): Player {
    return this._player2;
  }

  get player1Name(): string {
    return this._player1.name ?? 'John';
  }

  set player1Name(name: string) {
    this._player1.name = name;
  }

  get player2Name(): string {
    return this._player2.name ?? 'Jane';
  }

  set player2Name(name: string) {
    this._player2.name = name;
  }

  get chance(): PlayerChance {
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

  public gameDoneObservable(): Observable<GameResults> {
    return this.$gameDone.asObservable();
  }

  resetGame() {
    this._chance = PlayerChance.ONE;
    this._gameInProgress = false;
    this._tiles = [];
    this._player1.tiles = [];
    this._player2.tiles = [];
    this.boxes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.togglePlayer();
  }

  constructor() {}

  togglePlayer() {
    [this.player1Name, this.player2Name] = [this.player2Name, this.player1Name];
  }

  toggleTurn(tileNum: number) {
    this._gameInProgress = true;
    switch (this._chance) {
      case PlayerChance.ONE:
        this._player1.tiles.push(tileNum);
        this.checkBoard(tileNum);
        this._chance = PlayerChance.TWO;
        break;
      case PlayerChance.TWO:
        this._player2.tiles.push(tileNum);
        this.checkBoard(tileNum);
        this._chance = PlayerChance.ONE;
        break;
    }
  }

  private checkBoard(tileNum: number) {
    let currentPlayerArray: number[] = [];
    this.boxes = this.boxes.filter((box) => box !== tileNum);

    if (this._chance === PlayerChance.ONE) {
      this._player1.tiles.sort();
      currentPlayerArray = this._player1.tiles;
    } else {
      this._player2.tiles.sort();
      currentPlayerArray = this._player2.tiles;
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

    if (checkState) {
      this.$gameDone.next(
        this._chance === PlayerChance.ONE
          ? (PlayerChance.ONE as any)
          : (PlayerChance.TWO as any)
      );

      return;
    }

    // tied
    if (this.boxes.length === 0) {
      this.$gameDone.next(GameResults.TIED);
    }
  }
}
