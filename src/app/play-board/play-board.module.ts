import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { GameOverDialogComponent } from './game-over-dialog/game-over-dialog.component';
import { PlayBoardRoutingModule } from './play-board-routing.module';
import { PlayGameComponent } from './play-game/play-game.component';

@NgModule({
  declarations: [PlayGameComponent, GameOverDialogComponent],
  imports: [
    CommonModule,
    PlayBoardRoutingModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
  ],
})
export class PlayBoardModule {}
