import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type ColorCable = 'rojo' | 'azul' | 'verde' | 'amarillo';
type EstadoLed = 'apagado' | 'amarillo' | 'verde' | 'rojo';

@Component({
  selector: 'app-cables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cables.component.html',
  styleUrls: ['./cables.component.css']
})
export class CablesComponent implements OnInit, OnDestroy {

  // CONFIG
  ordenCorrecto: ColorCable[] = ['azul', 'rojo', 'verde', 'amarillo'];
  codigoFinal = 0;

  // ESTADO GENERAL
  juegoIniciado = false;
  completado = false;
  error = false;

  // EFECTOS VISUALES
  emergencia = false;
  temblar = false;

  // CABLES
  ordenJugador: ColorCable[] = [];
  cablesCortados: ColorCable[] = [];

  // LEDS (HTML ANTIGUO)
  leds: EstadoLed[] = ['apagado', 'apagado', 'apagado', 'apagado'];

  // TIEMPO
  tiempo = 60;
  timerInterval: any;

  // AUDIO
  ticTacAudio!: HTMLAudioElement;

  constructor(private router: Router) {}

  ngOnInit() {
    this.ticTacAudio = new Audio('assets/audio/tictac.mp3');
    this.ticTacAudio.loop = true;
    this.ticTacAudio.volume = 0.5;
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    this.ticTacAudio.pause();
  }

  // ===== INICIO =====
  iniciarPrueba() {
    this.juegoIniciado = true;
    this.tiempo = 60;
    this.ticTacAudio.currentTime = 0;
    this.ticTacAudio.play();
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.completado || this.error) return;

      this.tiempo--;

      if (this.tiempo <= 10) {
        this.emergencia = true;
        this.temblar = true;
      }

      if (this.tiempo <= 0) {
        this.activarError();
      }
    }, 1000);
  }

  // ===== CABLES =====
  cortarCable(color: ColorCable) {
    if (this.completado || this.error) return;
    if (this.cablesCortados.includes(color)) return;

    this.cablesCortados.push(color);
    this.ordenJugador.push(color);

    const index = this.ordenJugador.length - 1;
    this.leds[index] = 'amarillo';

    if (this.ordenJugador.length === this.ordenCorrecto.length) {
      this.comprobarOrden();
    }
  }

  comprobarOrden() {
    const correcto =
      JSON.stringify(this.ordenJugador) === JSON.stringify(this.ordenCorrecto);

    clearInterval(this.timerInterval);
    this.ticTacAudio.pause();
    this.ticTacAudio.currentTime = 0;

    if (correcto) {
      this.completado = true;
      this.leds = this.leds.map(() => 'verde');
      this.reproducirSonido('correcto');

      setTimeout(() => {
        this.router.navigate(['/final']);
      }, 3000);

    } else {
      this.leds = this.leds.map(() => 'rojo');
      this.activarError();
    }
  }

  // ===== ERROR =====
  activarError() {
    this.error = true;
    this.emergencia = true;
    this.temblar = true;

    clearInterval(this.timerInterval);
    this.ticTacAudio.pause();
    this.ticTacAudio.currentTime = 0;

    this.reproducirSonido('explosion');

    setTimeout(() => {
      this.resetear();
    }, 2000);
  }

  resetear() {
    this.ordenJugador = [];
    this.cablesCortados = [];
    this.leds = ['apagado', 'apagado', 'apagado', 'apagado'];

    this.error = false;
    this.completado = false;
    this.emergencia = false;
    this.temblar = false;

    this.juegoIniciado = false;
  }

  // ===== UTILS =====
  estaCortado(color: ColorCable): boolean {
    return this.cablesCortados.includes(color);
  }

  reproducirSonido(tipo: 'explosion' | 'correcto') {
    const audio = new Audio(
      tipo === 'explosion'
        ? 'assets/audio/explosion.mp3'
        : 'assets/audio/correcto.mp3'
    );
    audio.play();
  }
}
