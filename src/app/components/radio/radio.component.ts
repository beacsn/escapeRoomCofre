// radio.component.ts
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Si usas ngClass, si no no hace falta

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule], // Ajusta imports según tu versión final
  templateUrl: './radio.component.html',
  // ...
})
export class RadioComponent implements OnDestroy { // Implementa OnDestroy para limpiar el temporizador
  frecuenciaActual: number = 88.0;
  frecuenciaGanadora: number = 104.2;
  margenExito: number = 0.01; // ¡Muy estricto!
  tiempoSintonizacionMs: number = 2000; // Tiempo que debe mantenerlo quieto (2 segundos)

  sintonizandoTimeout: any = null;
  porcentajeSintonizado: number = 0; // Para mostrar una barra de progreso

  pruebaCompletada: boolean = false;
  isFlashing: boolean = false; // Lo mantenemos para el efecto visual del 1

  audio!: HTMLAudioElement;
  audioUnlocked = false;

   @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

 ngOnDestroy() {
     if (this.sintonizandoTimeout) {
       clearTimeout(this.sintonizandoTimeout);
     }
     // Pausa el audio al salir del componente
     if (this.audioPlayerRef && this.audioPlayerRef.nativeElement) {
       this.audioPlayerRef.nativeElement.pause();
     }
   }

  ngAfterViewInit() {
  //this.audio = new Audio('radio-static.mp3');
  this.audio.loop = true;
  this.audio.volume = 0.6;
}

unlockAudio() {
  if (!this.audioUnlocked && this.audioPlayerRef?.nativeElement) {
    this.audioPlayerRef.nativeElement
      .play()
      .then(() => this.audioUnlocked = true)
      .catch(err => console.warn('Audio bloqueado:', err));
  }
}

silenciarAudio() {
  if (this.audioPlayerRef?.nativeElement) {
    this.audioPlayerRef.nativeElement.pause();
  }
}

  get opacidadEstatica(): number {
    // Si está completado o flasheando, no hay estática
    if (this.pruebaCompletada || this.isFlashing) return 0;

    const distancia = Math.abs(this.frecuenciaActual - this.frecuenciaGanadora);
    // Controlamos la opacidad general por la distancia actual
    //return Math.min(0.9, distancia / 4);

    const volumen = Math.min(0.9, distancia / 4);

    // Ajusta el volumen del elemento nativo si existe
    if (this.audioPlayerRef && this.audioPlayerRef.nativeElement) {
      //console.log(volumen);
      this.audioPlayerRef.nativeElement.volume = volumen;
    }

    return volumen; // Devuelve el mismo valor para la opacidad visual
  }

  comprobarSintonizacion() {
     this.unlockAudio();
    const distancia = Math.abs(this.frecuenciaActual - this.frecuenciaGanadora);

    if (distancia <= this.margenExito) {
      // Si está en el punto exacto, empezamos (o continuamos) el temporizador
      if (!this.sintonizandoTimeout) {
        this.iniciarSintonizacionTemporizada();
      }
      this.porcentajeSintonizado = (this.tiempoSintonizacionMs - (this.sintonizandoTimeout ? this.sintonizandoTimeout._idleTimeout : this.tiempoSintonizacionMs)) / this.tiempoSintonizacionMs * 100;

    } else {
      // Si se mueve, reiniciamos el temporizador y el progreso
      this.resetearSintonizacion();
    }
  }

  iniciarSintonizacionTemporizada() {
    this.sintonizandoTimeout = setTimeout(() => {
      this.isFlashing = true; // Empieza el flash del 5
      this.porcentajeSintonizado = 100;

      setTimeout(() => {
        this.isFlashing = false;
        this.pruebaCompletada = true; // La prueba se completa, el 5 desaparece pero el botón se queda
      }, 1500); // Duración del flash

    }, this.tiempoSintonizacionMs);
  }

  resetearSintonizacion() {
    if (this.sintonizandoTimeout) {
      clearTimeout(this.sintonizandoTimeout);
      this.sintonizandoTimeout = null;
      this.porcentajeSintonizado = 0;
    }
  }

  // Si has usado la solución de ngClass, necesitarás esta función
  get pantallaClasses() {
    return {
      'relative': true, 'w-full': true, 'h-40': true, 'bg-black': true, 'rounded-lg': true,
      'overflow-hidden': true, 'border-4': true, 'border-amber-900': true, 'mb-6': true,
      'shadow-lg': this.pruebaCompletada,
      'shadow-amber-500/50': this.pruebaCompletada,
    };
  }
}
