import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Player {
  tiles: number[];
}

export interface Tile {
  color: string;
  tileNum: number;
  tileClass: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PlaySessionService {
  private _gameInProgress: boolean = false;
  private _chance: 1 | 2 = 1;
  private _player1: Player = { tiles: [] };
  private _player2: Player = { tiles: [] };
  private _tiles: Tile[] = [];
  private boxes: number[] = [];
  private $gameDone: Subject<1 | 2 | 'tied'> = new Subject();
  private winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [3, 4, 6],
  ];

  get player1(): Player {
    return this._player1;
  }

  get player2(): Player {
    return this._player2;
  }

  get chance(): 1 | 2 {
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

  public gameDoneObservable(): Observable<1 | 2 | 'tied'> {
    return this.$gameDone.asObservable();
  }

  resetGame() {
    this._chance = 1;
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
      case 1:
        this._player1.tiles.push(tileNum);
        this.checkBoard(tileNum);
        this._chance = 2;
        break;
      case 2:
        this._player2.tiles.push(tileNum);
        this.checkBoard(tileNum);
        this._chance = 1;
        break;
    }
  }

  private checkBoard(tileNum: number) {
    let currentPlayerArray: number[] = [];
    this.boxes = this.boxes.filter((box) => box !== tileNum);

    if (this._chance === 1) {
      this._player1.tiles.sort();
      currentPlayerArray = this._player1.tiles;
    } else {
      this._player2.tiles.sort();
      currentPlayerArray = this._player2.tiles;
    }

    const checkState = this.winPatterns.some((pattern) => {
      let retVal = true;
      pattern.forEach((num) => {
        if (!currentPlayerArray.includes(num)) {
          retVal = false;
        }
      });
      return retVal;
    });

    if (checkState) {
      this.$gameDone.next(this._chance as any);
    }

    // tied
    if (this.boxes.length === 0) {
      this.$gameDone.next('tied');
    }
  }
}
