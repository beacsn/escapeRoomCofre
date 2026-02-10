import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GEMMA_ALEX } from '../images.base64'; // ajusta la ruta si cambia
import { GameStateService } from '../../core/game-state.service';

@Component({
  selector: 'app-felicidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './felicidades.component.html',
  styleUrls: ['./felicidades.component.css']
})
export class FelicidadesComponent {

  // Imagen final (base64)
  readonly imagenFinal = GEMMA_ALEX;

  constructor(
    private router: Router,
    private game: GameStateService // 🔹 inyecta el service
  ) {
    // 🔹 parar temporizador global al entrar en la pantalla de felicitaciones
    this.game.stopTimer();
  }

  volverAlInicio() {
    this.router.navigate(['/']);
  }
}
