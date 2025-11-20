import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JsonStorageService } from '../services/json-storage.service';

@Component({
  selector: 'app-registro-madre',
  templateUrl: './registro-madre.page.html',
  styleUrls: ['./registro-madre.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegistroMadrePage {
  madre = {
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    edad: '',
    semanaGestacion: '',
    telefono: '',
    presionArterial: '',
    grupoSanguineo: '',
    alergias: '',
    enfermedadesCronicas: ''
  };

  edadInvalida = false;
  semanaInvalida = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private jsonStorage: JsonStorageService
  ) {}

  async onSubmit() {
    await this.registrarMadre();
  }

  async registrarMadre() {
    try {
      if (!this.madre.nombre || !this.madre.email || !this.madre.password) {
        await this.mostrarAlerta('Error', 'Completa los campos obligatorios');
        return;
      }

      if (this.madre.password !== this.madre.confirmPassword) {
        await this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
        return;
      }

      const madres = await this.jsonStorage.getData('registrosMadres') || [];
      
      const nuevaMadre = {
        id: Date.now().toString(),
        ...this.madre,
        tipo: 'madre',
        activo: true,
        fechaRegistro: new Date().toISOString()
      };

      madres.push(nuevaMadre);
      await this.jsonStorage.saveData('registrosMadres', madres);

      await this.mostrarAlerta('Éxito', 'Registro completado');
      this.router.navigate(['/login-madre']);

    } catch (error) {
      console.error('Error:', error);
      await this.mostrarAlerta('Error', 'Error al registrar');
    }
  }

  validarEdad() {
    // Validación simple de edad
    const edad = parseInt(this.madre.edad);
    this.edadInvalida = isNaN(edad) || edad < 12 || edad > 50;
  }

  validarSemana() {
    // Validación simple de semana
    const semana = parseInt(this.madre.semanaGestacion);
    this.semanaInvalida = isNaN(semana) || semana < 1 || semana > 42;
  }

  calcularFPP(): string {
    // Cálculo simple de FPP
    if (!this.madre.semanaGestacion) return 'Ingresa semana de gestación';
    const semanas = parseInt(this.madre.semanaGestacion);
    if (isNaN(semanas)) return 'Semana inválida';
    
    const fechaActual = new Date();
    const fpp = new Date(fechaActual);
    fpp.setDate(fechaActual.getDate() + ((40 - semanas) * 7));
    
    return fpp.toLocaleDateString();
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
