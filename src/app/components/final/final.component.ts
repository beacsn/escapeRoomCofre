// src/app/components/final/final.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Añade FormsModule aquí
})
export class FinalComponent {
  // Define el código secreto de tu candado físico
  readonly SECRET_CODE = "210"; // Usa tu código real aquí

  // Variables para almacenar los dígitos introducidos
  digit1: string = '';
  digit2: string = '';
  digit3: string = '';

  constructor(private router: Router) {}

  checkCode() {
    const inputCode = `${this.digit1}${this.digit2}${this.digit3}`;

    if (inputCode === this.SECRET_CODE) {
      alert("¡COFRE ABIERTO! 🎉🎁 ¡Felicidades!");
      // Redirige a una página de "Feliz cumpleaños/aniversario" (necesitarías otra ruta/componente)
      // this.router.navigate(['/felicidades']);
    } else {
      alert("Código incorrecto. Inténtalo de nuevo.");
      // Limpia los campos para facilitar un nuevo intento
      this.digit1 = '';
      this.digit2 = '';
      this.digit3 = '';
    }
  }
}

