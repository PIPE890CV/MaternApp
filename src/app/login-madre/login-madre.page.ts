import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JsonStorageService } from '../services/json-storage.service';

@Component({
  selector: 'app-login-madre',
  templateUrl: './login-madre.page.html',
  styleUrls: ['./login-madre.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginMadrePage {
  credenciales = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private jsonStorage: JsonStorageService
  ) {}

  async login() {
    try {
      if (!this.credenciales.email || !this.credenciales.password) {
        await this.mostrarAlerta('Error', 'Por favor ingresa email y contraseña');
        return;
      }

      const madres = await this.jsonStorage.getData('registrosMadres') || [];
      
      const madreEncontrada = madres.find((madre: any) => 
        madre.email === this.credenciales.email && 
        madre.password === this.credenciales.password
      );

      if (madreEncontrada) {
        // GUARDAR SESIÓN DE MADRE CORRECTAMENTE
        const datosSesion = {
          id: madreEncontrada.id,
          nombre: madreEncontrada.nombre,
          email: madreEncontrada.email,
          tipo: 'madre',
          fechaLogin: new Date().toISOString()
        };

        await this.jsonStorage.saveData('usuarioActual', datosSesion);

        await this.mostrarAlerta('Éxito', `Bienvenida ${madreEncontrada.nombre}`);
        
        // Navegar con timeout para evitar problemas
        setTimeout(() => {
          this.router.navigate(['/historial-personal']);
        }, 500);
        
      } else {
        await this.mostrarAlerta('Error', 'Email o contraseña incorrectos');
      }

    } catch (error) {
      console.error('Error en login:', error);
      await this.mostrarAlerta('Error', 'Ocurrió un error al iniciar sesión');
    }
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  irARegistro() {
    this.router.navigate(['/registro-madre']);
  }

  async recuperarPassword() {
    await this.mostrarAlerta('Recuperar Contraseña', 'Función en desarrollo. Contacta al administrador.');
  }
}
