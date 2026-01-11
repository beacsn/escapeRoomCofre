import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit, OnDestroy {
  // 30 minutos en segundos (30 * 60 = 1800)
  timeLeft = signal(1800);
  intervalId: any;

  // Propiedades para daisyUI (minutos y segundos)
  get minutes() { return Math.floor(this.timeLeft() / 60); }
  get seconds() { return this.timeLeft() % 60; }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(time => time - 1);
      } else {
        clearInterval(this.intervalId);
        // Aquí podrías disparar un evento de "Game Over"
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  audio = new Audio('tricky-fox-188090.mp3');

toggleAudio(event: any) {
  console.log('Botón de audio pulsado'); // Depuración
  const isChecked = event.target.checked;
  if (isChecked) {
    this.audio.loop = true;
    this.audio.play();
    console.log('Reproduciendo audio'); // Depuración
  } else {
    this.audio.pause();
    console.log('Audio pausado'); // Depuración
  }
}

}
