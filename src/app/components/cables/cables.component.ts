import { Component } from '@angular/core';
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
export class CablesComponent {

  // ---- CONFIGURACIÓN DEL PUZZLE ----
  ordenCorrecto: ColorCable[] = ['azul', 'rojo', 'verde', 'amarillo'];
  codigoFinal = 0;

  // ---- ESTADO DEL JUEGO ----
  ordenJugador: ColorCable[] = [];
  cablesCortados: ColorCable[] = [];
  completado = false;
  error = false;

  cortarCable(color: ColorCable) {
    if (this.completado || this.cablesCortados.includes(color)) {
      return;
    }

    this.ordenJugador.push(color);
    this.cablesCortados.push(color);

    if (this.ordenJugador.length === this.ordenCorrecto.length) {
      this.comprobarOrden();
    }
  }

  comprobarOrden() {
    const correcto =
      JSON.stringify(this.ordenJugador) === JSON.stringify(this.ordenCorrecto);

    if (correcto) {
      this.completado = true;
      this.error = false;
    } else {
      this.error = true;

      // Pequeño delay antes de resetear para que se vea el error
      setTimeout(() => {
        this.resetear();
      }, 1200);
    }
  }

  resetear() {
    this.ordenJugador = [];
    this.cablesCortados = [];
    this.error = false;
  }

  // Para aplicar clases CSS dinámicas
  estaCortado(color: ColorCable): boolean {
    return this.cablesCortados.includes(color);
  }
}
