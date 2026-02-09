import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-game-shell',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './game-shell.component.html'
})
export class GameShellComponent {
  constructor(public game: GameStateService) {
    this.game.startTimer();
  }
}
