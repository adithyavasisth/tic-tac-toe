import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayGameComponent } from './play-game/play-game.component';

const routes: Routes = [{ path: 'play', component: PlayGameComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayBoardRoutingModule {}
