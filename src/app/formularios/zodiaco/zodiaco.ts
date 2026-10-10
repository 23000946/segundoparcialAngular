import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

interface ResultadoZodiaco {
  nombreCompleto: string;
  edad: number;
  signo: string;
  imagenSigno: string;
}

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-zodiaco',
  styleUrl: './zodiaco.css',
  templateUrl: './zodiaco.html',
})
export class Zodiaco implements OnInit {

  formulario!: FormGroup;
  resultado: ResultadoZodiaco | null = null;

  private readonly signosChinos: string[] = [
    'Mono', 'Gallo', 'Perro', 'Cerdo',
    'Raton', 'Buey', 'Tigre', 'Conejo',
    'Dragon', 'Serpiente', 'Caballo', 'Cabra'
  ];

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('Daniel', Validators.required),
      apellidop: new FormControl('Garcia', Validators.required),
      apellidom: new FormControl('Rodarte', Validators.required),
      dia: new FormControl('26', [Validators.required, Validators.min(1), Validators.max(31)]),
      mes: new FormControl('06', [Validators.required, Validators.min(1), Validators.max(12)]),
      anio: new FormControl('2005', [Validators.required, Validators.min(1900)]),
      sexo: new FormControl('Masculino', Validators.required)
    });
  }

  imprimir(): void {
    if (this.formulario.invalid) {
      return;
    }

    const { nombre, apellidop, apellidom, dia, mes, anio } = this.formulario.value;

    const fechaNacimiento = new Date(Number(anio), Number(mes)-1, Number(dia));
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    const indiceSigno = Number(anio) % 12;
    const signo = this.signosChinos[indiceSigno];

    this.resultado = {
      nombreCompleto: `${nombre} ${apellidop} ${apellidom}`,
      edad,
      signo,
      imagenSigno: `${signo}.png`
    };
  }
}