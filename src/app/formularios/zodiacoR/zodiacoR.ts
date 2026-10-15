import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IZodiaco } from '../zodiaco/usuario';
import { Router } from '@angular/router'; 

interface ResultadoZodiaco {
  nombreCompleto: string;
  edad: number;
  signo: string;
  imagenSigno: string;
  sexo: string;
}

@Component({
  selector: 'app-zodiacoR',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './zodiacoR.css',
  templateUrl: './zodiacoR.html',
})
export class Zodiaco implements OnInit {

  formulario!: FormGroup;
  resultado: ResultadoZodiaco | null = null;
  constructor(private router: Router) {}
  usuarios: IZodiaco[] = [];
  
  mostrarTabla: boolean = false;
  
  nuevoUsuario: IZodiaco = {
    nombreCompleto: '',
    edad: 0,
    signo: '',
    imagenSigno: '',
    sexo: '',
    dia: '',
    mes: '',
    anio: ''
  };
  
  indiceEdicion: number = -1;
  
  private readonly signosChinos: string[] = [
    'Mono', 'Gallo', 'Perro', 'Cerdo',
    'Raton', 'Buey', 'Tigre', 'Conejo',
    'Dragon', 'Serpiente', 'Caballo', 'Cabra'
  ];

  ngOnInit(): void {
    this.cargarUsuario();
    
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

    const { nombre, apellidop, apellidom, dia, mes, anio, sexo } = this.formulario.value;

    const fechaNacimiento = new Date(Number(anio), Number(mes) - 1, Number(dia));
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    const indiceSigno = Number(anio) % 12;
    const signo = this.signosChinos[indiceSigno];

    const nombreCompleto = `${nombre} ${apellidop} ${apellidom}`;
    const imagenSigno = `${signo}.png`;

    this.nuevoUsuario = {
      nombreCompleto,
      edad,
      signo,
      imagenSigno,
      sexo,
      dia,
      mes,
      anio
    };

    if (this.indiceEdicion !== -1) {
      this.usuarios[this.indiceEdicion] = { ...this.nuevoUsuario };
      
      this.indiceEdicion = -1; 
    } else {
      this.usuarios.push({ ...this.nuevoUsuario });
    }

    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

    this.resultado = {
      nombreCompleto,
      edad,
      signo,
      imagenSigno,
      sexo
    };
  }

  editarResultado(index: number): void {
    const usuarioSeleccionado = this.usuarios[index];
    this.indiceEdicion = index;

    const partesNombre = usuarioSeleccionado.nombreCompleto.trim().split(' ');
    const nombre = partesNombre[0] || '';
    const apellidop = partesNombre[1] || '';
    const apellidom = partesNombre.slice(2).join(' ') || '';

    this.formulario.patchValue({
      nombre: nombre,
      apellidop: apellidop,
      apellidom: apellidom,
      dia: usuarioSeleccionado.dia,
      mes: usuarioSeleccionado.mes,
      anio: usuarioSeleccionado.anio,
      sexo: usuarioSeleccionado.sexo
    });
  }

  cargarUsuario(): void {
    const datos = localStorage.getItem('usuarios');
    if (datos) {
      this.usuarios = JSON.parse(datos);
    }
  }

  eliminarUsuario(index: number): void {
    this.usuarios.splice(index, 1);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }
  irARutaZodiaco(): void {
    this.router.navigate(['/formularios/zodiaco']);
  }

}