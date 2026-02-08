// src/app/components/final/final.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink] // Añade FormsModule aquí
 // Añade FormsModule aquí
})
export class FinalComponent {
  // Define el código secreto de tu candado físico
  readonly SECRET_CODE = "210"; // Usa tu código real aquí

  // Variables para almacenar los dígitos introducidos
  digit1: string = '';
  digit2: string = '';
  digit3: string = '';

  cofreAbierto: boolean = false;
  codigoIncorrecto: boolean = false;


  constructor(private router: Router) {}

  checkCode() {
    const inputCode = `${this.digit1}${this.digit2}${this.digit3}`;

    if (inputCode === this.SECRET_CODE) {
      this.cofreAbierto = true;
      this.codigoIncorrecto = false;
    } else {
      this.codigoIncorrecto = true;

      this.digit1 = '';
      this.digit2 = '';
      this.digit3 = '';
    }
  }

}

