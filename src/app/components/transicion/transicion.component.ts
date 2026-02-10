import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transicion',
  standalone: true,
  templateUrl: './transicion.component.html'
})
export class TransicionComponent {

  @Input() imagenBase64!: string;
  @Input() mensaje!: string;

  @Output() continuar = new EventEmitter<void>();

  seguir() {
    this.continuar.emit();
  }
}
