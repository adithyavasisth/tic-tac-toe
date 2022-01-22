import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanPlayGuard } from './play-game/can-play.guard';
import { PlayGameComponent } from './play-game/play-game.component';

const routes: Routes = [
  { path: 'play', component: PlayGameComponent, canActivate: [CanPlayGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayBoardRoutingModule {}
