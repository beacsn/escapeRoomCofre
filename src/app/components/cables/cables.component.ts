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

  // ---- CONFIGURACIÓN DEL PUZZLE ----
  ordenCorrecto: ColorCable[] = ['azul', 'rojo', 'verde', 'amarillo'];

  // ---- ESTADO DEL JUEGO ----
  ordenJugador: ColorCable[] = [];
  cablesCortados: ColorCable[] = [];
  completado = false;
  error = false;

  // ---- TEMPORIZADOR ----
  tiempo = 60;
  timerInterval: any;

  // ---- LEDS DE PROGRESO ----
  leds: { encendido: boolean; animando: boolean; colorFinal?: 'success' | 'error' }[] = [
    { encendido: false, animando: false },
    { encendido: false, animando: false },
    { encendido: false, animando: false },
    { encendido: false, animando: false },
  ];

  ngOnInit() {
    this.iniciarTemporizador();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  iniciarTemporizador() {
    this.timerInterval = setInterval(() => {
      if (!this.completado && !this.error) {
        this.tiempo--;
        this.reproducirSonido('tic'); // Tic-tac cada segundo
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

    // Animar LED correspondiente al cable cortado
    const index = this.ordenJugador.length - 1;
    this.animarLED(index);

    // Comprobar al final
    if (this.ordenJugador.length === this.ordenCorrecto.length) {
      this.comprobarOrden();
    }

    // Sonido opcional de corte
    // this.reproducirSonido('tic');
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

      // LEDs verdes
      this.leds.forEach(led => {
        led.encendido = true;
        led.animando = false;
        led.colorFinal = 'success';
      });

      this.reproducirSonido('correcto');
    } else {
      // LEDs rojos antes de reiniciar
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
    this.reproducirSonido('explosion');

    setTimeout(() => {
      this.resetear();
      this.tiempo = 60;
      this.iniciarTemporizador();
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

  reproducirSonido(nombre: 'tic' | 'explosion' | 'correcto') {
    let audio: HTMLAudioElement;
    switch (nombre) {
      case 'tic':
        audio = new Audio('assets/sounds/tictac.mp3');
        audio.play();
        break;
      case 'explosion':
        audio = new Audio('assets/sounds/explosion.mp3');
        audio.play();
        break;
      case 'correcto':
        audio = new Audio('assets/sounds/correcto.mp3');
        audio.play();
        break;
    }
  }
}
