import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../core/game-state.service';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './radio.component.html',
})
export class RadioComponent implements AfterViewInit, OnDestroy {

 constructor(private game: GameStateService) {}

  // ======================
  // CONFIGURACIÓN GENERAL
  // ======================

  frecuenciaActual: number = 88.0;
  frecuenciaGanadora: number = 104.2;
  margenExito: number = 0.01;

  tiempoSintonizacionMs: number = 2000;   // mantener frecuencia
  tiempoMostrarCodigoMs: number = 1500;  // tiempo visible del número
  tiempoTensionMs: number = 1000;         // pausa antes de completar

  // ======================
  // ESTADO DE LA PRUEBA
  // ======================

  porcentajeSintonizado: number = 0;
  pruebaCompletada: boolean = false;
  isFlashing: boolean = false;

  private sintonizandoTimeout: any = null;
  private signalPlayed: boolean = false;

  juegoIniciado: boolean = false;


  // ======================
  // AUDIO
  // ======================

  audioUnlocked: boolean = false;
  audioSignal!: HTMLAudioElement;

  @ViewChild('audioPlayer')
  audioPlayerRef!: ElementRef<HTMLAudioElement>;

  // ======================
  // CICLO DE VIDA
  // ======================

  ngAfterViewInit(): void {
    // Audio de señal encontrada
    this.audioSignal = new Audio('assets/audio/signal-found.mp3');
    this.audioSignal.volume = 0.8;
    this.game.muteAudio();
  }

  ngOnDestroy(): void {
    if (this.sintonizandoTimeout) {
      clearTimeout(this.sintonizandoTimeout);
    }

    if (this.audioPlayerRef?.nativeElement) {
      this.audioPlayerRef.nativeElement.pause();
    }

     this.game.unmuteAudio();
  }

  // ======================
  // AUDIO CONTROL
  // ======================

  unlockAudio(): void {
    if (!this.audioUnlocked && this.audioPlayerRef?.nativeElement) {
      this.audioPlayerRef.nativeElement
        .play()
        .then(() => this.audioUnlocked = true)
        .catch(() => {});
    }
  }

  private reproducirSenalEncontrada(): void {
    if (this.signalPlayed) return;

    this.signalPlayed = true;

    // Bajamos la estática
    if (this.audioPlayerRef?.nativeElement) {
      this.audioPlayerRef.nativeElement.volume = 0.05;
    }

    this.audioSignal.play().catch(() => {});
  }

  // ======================
  // LÓGICA DE SINTONIZADO
  // ======================

  comprobarSintonizacion(): void {
     if (!this.juegoIniciado) return;
    this.unlockAudio();

    const distancia = Math.abs(
      this.frecuenciaActual - this.frecuenciaGanadora
    );

    // Volumen de estática
    if (this.audioPlayerRef?.nativeElement) {
      const volumen = Math.min(1, Math.pow(distancia / 3, 2));
      this.audioPlayerRef.nativeElement.volume = volumen;
    }

    if (distancia <= this.margenExito) {
      if (!this.sintonizandoTimeout) {
        this.iniciarSintonizacionTemporizada();
      }
    } else {
      this.resetearSintonizacion();
    }
  }

  private iniciarSintonizacionTemporizada(): void {
    this.sintonizandoTimeout = setTimeout(() => {

      // 1️⃣ Aparece el número
      this.isFlashing = true;
      this.porcentajeSintonizado = 100;
      this.reproducirSenalEncontrada();

      // 2️⃣ El número desaparece
      setTimeout(() => {
        this.isFlashing = false;
      }, this.tiempoMostrarCodigoMs);

      // 3️⃣ Se completa la prueba tras una pausa
      setTimeout(() => {
        this.pruebaCompletada = true;
      }, this.tiempoMostrarCodigoMs + this.tiempoTensionMs);

    }, this.tiempoSintonizacionMs);
  }

  private resetearSintonizacion(): void {
    if (this.sintonizandoTimeout) {
      clearTimeout(this.sintonizandoTimeout);
      this.sintonizandoTimeout = null;
    }

    this.porcentajeSintonizado = 0;
  }

  // ======================
  // VISTA / UI
  // ======================

  get opacidadEstatica(): number {
    if (this.pruebaCompletada || this.isFlashing) return 0;

    const distancia = Math.abs(
      this.frecuenciaActual - this.frecuenciaGanadora
    );

    return Math.min(1, Math.pow(distancia / 3, 2));
  }

  get pantallaClasses() {
    return {
      'relative': true,
      'w-full': true,
      'h-40': true,
      'bg-black': true,
      'rounded-lg': true,
      'overflow-hidden': true,
      'border-4': true,
      'border-amber-900': true,
      'mb-6': true,
      'shadow-lg': this.pruebaCompletada,
      'shadow-amber-500/50': this.pruebaCompletada,
    };
  }

  get mensajePantalla(): string {
    if (this.pruebaCompletada) return 'SEÑAL ESTABLE';

    const distancia = Math.abs(
      this.frecuenciaActual - this.frecuenciaGanadora
    );

    if (distancia < 0.2) return 'SEÑAL CASI CLARA...';
    if (distancia < 0.5) return 'INTERFERENCIA BAJA';
    return 'BUSCANDO SEÑAL...';
  }

  iniciarRadio(): void {
    this.juegoIniciado = true;
  }

}
