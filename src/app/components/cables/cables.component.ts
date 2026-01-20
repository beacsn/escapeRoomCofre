import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type ColorCable = 'rojo' | 'azul' | 'verde' | 'amarillo';

@Component({
  selector: 'app-cables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cables.component.html',
  styleUrl: './cables.component.css'
})
export class CablesComponent implements OnDestroy {

  // ---- CONFIGURACIÓN DEL PUZZLE ----
  ordenCorrecto: ColorCable[] = ['azul', 'rojo', 'verde', 'amarillo'];
  codigoFinal = 0;

  // ---- ESTADO DEL JUEGO ----
  ordenJugador: ColorCable[] = [];
  cablesCortados: ColorCable[] = [];
  completado = false;
  error = false;

  // ---- ESTADO DE INTERFAZ / INMERSIÓN ----
  juegoIniciado = false;
  tiempo = 25;
  intervaloTiempo: any;
  tickAudio = new Audio('assets/audio/tictac.mp3');
  explosionAudio = new Audio('assets/audio/explosion.mp3');
  correctoAudio = new Audio('assets/audio/correcto.mp3');

  leds: ('apagado' | 'amarillo' | 'verde' | 'rojo')[] =
    ['apagado', 'apagado', 'apagado', 'apagado'];

  // Para efecto visual de vibración
  temblar = false;

  // Para efecto de emergencia
  emergencia = false;

  iniciarPrueba() {
    this.juegoIniciado = true;
    this.iniciarTemporizador();
    this.tickAudio.loop = true;
    this.tickAudio.play();
  }

  iniciarTemporizador() {
    this.intervaloTiempo = setInterval(() => {
      this.tiempo--;

      // Modo emergencia cuando queden 8s
      this.emergencia = this.tiempo <= 8;

      if (this.tiempo <= 0) {
        this.explotar();
      }
    }, 1000);
  }

  cortarCable(color: ColorCable) {
    if (this.completado || this.error || this.cablesCortados.includes(color)) {
      return;
    }

    // Efecto vibración breve
    this.temblar = true;
    setTimeout(() => this.temblar = false, 250);

    this.ordenJugador.push(color);
    this.cablesCortados.push(color);

    // Encender LED de progreso en amarillo
    this.leds[this.ordenJugador.length - 1] = 'amarillo';

    if (this.ordenJugador.length === this.ordenCorrecto.length) {
      this.comprobarOrden();
    }
  }

  comprobarOrden() {
    clearInterval(this.intervaloTiempo);
    this.tickAudio.pause();

    const correcto =
      JSON.stringify(this.ordenJugador) === JSON.stringify(this.ordenCorrecto);

    if (correcto) {
      this.completado = true;
      this.error = false;

      // Todos los LEDs a verde
      this.leds = this.leds.map(() => 'verde');

      this.correctoAudio.play();

    } else {
      this.error = true;

      // Todos los LEDs a rojo
      this.leds = this.leds.map(() => 'rojo');

      this.explosionAudio.play();

      setTimeout(() => {
        this.resetear();
      }, 1800);
    }
  }

  explotar() {
    clearInterval(this.intervaloTiempo);
    this.tickAudio.pause();
    this.explosionAudio.play();
    this.error = true;

    // LEDs rojos al explotar
    this.leds = this.leds.map(() => 'rojo');

    setTimeout(() => {
      this.resetear();
    }, 1800);
  }

  resetear() {
    this.ordenJugador = [];
    this.cablesCortados = [];
    this.leds = ['apagado', 'apagado', 'apagado', 'apagado'];
    this.tiempo = 25;
    this.error = false;
    this.emergencia = false;
  }

  estaCortado(color: ColorCable): boolean {
    return this.cablesCortados.includes(color);
  }

  ngOnDestroy() {
    clearInterval(this.intervaloTiempo);
  }
}
