import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PlaySessionService } from './../play-board/play-game/play-session.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  profileForm = this.fb.group({
    player1Name: [this.playSessionSvc.player1Name],
    player2Name: [this.playSessionSvc.player2Name],
  });

  constructor(
    readonly playSessionSvc: PlaySessionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  playGame() {
    this.playSessionSvc.player1Name =
      this.profileForm.get('player1Name')?.value;
    this.playSessionSvc.player2Name =
      this.profileForm.get('player2Name')?.value;
    this.playSessionSvc.resetGame();
  }
}
