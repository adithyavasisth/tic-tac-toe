import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameResults } from '../models';

/**
 * @description The Dialog Component which displays the Game Result
 */
@Component({
  selector: 'app-game-result-dialog',
  templateUrl: './game-result-dialog.component.html',
  styleUrls: ['./game-result-dialog.component.scss'],
})
export class GameResultDialogComponent implements OnInit {
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<GameResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.result === GameResults.TIED) {
      this.message = 'The game has tied! Play again.';
    } else {
      this.message = `${this.data.result} has won the game!`;
    }
  }
}
