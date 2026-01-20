import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type ColorCable = 'rojo' | 'azul' | 'verde' | 'amarillo';

@Component({
  selector: 'app-cables',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cables.component.html',
  styleUrls: ['./cables.component.css']
})
export class CablesComponent implements OnInit, OnDestroy {

  // ---- CONFIGURACIÓN ----
  ordenCorrecto: ColorCable[] = ['azul', 'rojo', 'verde', 'amarillo'];

  // ---- ESTADO ----
  iniciado = false;
  ordenJugador: ColorCable[] = [];
  cablesCortados: ColorCable[] = [];
  completado = false;
  error = false;

  // ---- TEMPORIZADOR ----
  tiempo = 60;
  timerInterval: any;

  // ---- AUDIO ----
  ticTacAudio!: HTMLAudioElement;

  // ---- LEDS ----
  leds: { encendido: boolean; animando: boolean; colorFinal?: 'success' | 'error' }[] = [
    { encendido: false, animando: false },
    { encendido: false, animando: false },
    { encendido: false, animando: false },
    { encendido: false, animando: false },
  ];

  ngOnInit() {
    this.ticTacAudio = new Audio('assets/audio/tictac.mp3');
    this.ticTacAudio.loop = true;
    this.ticTacAudio.volume = 0.5;
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    this.ticTacAudio.pause();
  }

  // ====== NUEVO: INICIO CON BOTÓN ======
  iniciarPrueba() {
    this.iniciado = true;
    this.ticTacAudio.play();
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.timerInterval = setInterval(() => {
      if (!this.completado && !this.error) {
        this.tiempo--;

        if (this.tiempo <= 0) {
          this.activarError();
        }
      }
    }, 1000);
  }

  cortarCable(color: ColorCable) {
    if (this.completado || this.cablesCortados.includes(color)) return;

    this.ordenJugador.push(color);
    this.cablesCortados.push(color);

    const index = this.ordenJugador.length - 1;
    this.animarLED(index);

    if (this.ordenJugador.length === this.ordenCorrecto.length) {
      this.comprobarOrden();
    }
  }

  animarLED(index: number) {
    if (index < 0 || index >= this.leds.length) return;

    this.leds[index].animando = true;

    setTimeout(() => {
      this.leds[index].animando = false;
      this.leds[index].encendido = true;
    }, 400);
  }

  comprobarOrden() {
    const correcto =
      JSON.stringify(this.ordenJugador) === JSON.stringify(this.ordenCorrecto);

    if (correcto) {
      this.completado = true;
      this.error = false;
      clearInterval(this.timerInterval);

      this.ticTacAudio.pause();
      this.ticTacAudio.currentTime = 0;

      this.leds.forEach(led => {
        led.encendido = true;
        led.animando = false;
        led.colorFinal = 'success';
      });

      this.reproducirSonido('correcto');

    } else {
      this.leds.forEach(led => {
        led.encendido = true;
        led.animando = false;
        led.colorFinal = 'error';
      });

      this.activarError();
    }
  }

  activarError() {
    this.error = true;
    clearInterval(this.timerInterval);

    this.ticTacAudio.pause();
    this.ticTacAudio.currentTime = 0;

    this.reproducirSonido('explosion');

    setTimeout(() => {
      this.resetear();
      this.tiempo = 60;
      this.iniciado = false;
    }, 1500);
  }

  resetear() {
    this.ordenJugador = [];
    this.cablesCortados = [];
    this.error = false;
    this.completado = false;

    this.leds.forEach(led => {
      led.encendido = false;
      led.animando = false;
      delete led.colorFinal;
    });
  }

  estaCortado(color: ColorCable): boolean {
    return this.cablesCortados.includes(color);
  }

  reproducirSonido(nombre: 'explosion' | 'correcto') {
    const audio = new Audio(
      nombre === 'explosion'
        ? 'assets/audio/explosion.mp3'
        : 'assets/audio/correcto.mp3'
    );
    audio.play();
  }
}
