import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JsonStorageService } from '../services/json-storage.service';

@Component({
  selector: 'app-login-medico',
  templateUrl: './login-medico.page.html',
  styleUrls: ['./login-medico.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginMedicoPage {
  // Propiedades para el sistema de segmentos
  modo: string = 'login';
  
  // Credenciales para login
  credenciales = {
    email: '',
    password: ''
  };

  // Datos para registro
  nuevoMedico = {
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
    especialidad: '',
    matricula: '',
    telefono: '',
    hospital: ''
  };

  especialidades = [
    'Ginecología',
    'Obstetricia',
    'Pediatría',
    'Medicina General',
    'Enfermería',
    'Otros'
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private jsonStorage: JsonStorageService
  ) {}

  cambiarModo(modo: string) {
    this.modo = modo;
  }

  // LOGIN
  async onLogin() {
    try {
      if (!this.credenciales.email || !this.credenciales.password) {
        await this.mostrarAlerta('Error', 'Por favor ingresa email y contraseña');
        return;
      }

      const medicos = await this.jsonStorage.getData('medicosRegistrados') || [];
      
      const medicoEncontrado = medicos.find((medico: any) => 
        medico.email === this.credenciales.email && 
        medico.password === this.credenciales.password
      );

      if (medicoEncontrado) {
        await this.jsonStorage.saveData('usuarioActual', {
          id: medicoEncontrado.id,
          nombre: medicoEncontrado.nombre,
          email: medicoEncontrado.email,
          tipo: 'medico',
          especialidad: medicoEncontrado.especialidad,
          fechaLogin: new Date().toISOString()
        });

        await this.mostrarAlerta('Éxito', `Bienvenido Dr. ${medicoEncontrado.nombre}`);
        this.router.navigate(['/dashboard-medico']);
      } else {
        await this.mostrarAlerta('Error', 'Email o contraseña incorrectos');
      }

    } catch (error) {
      console.error('Error en login médico:', error);
      await this.mostrarAlerta('Error', 'Ocurrió un error al iniciar sesión');
    }
  }

  // REGISTRO
  async onRegistro() {
    try {
      // Validaciones
      if (!this.nuevoMedico.nombre || !this.nuevoMedico.email || !this.nuevoMedico.password) {
        await this.mostrarAlerta('Error', 'Completa los campos obligatorios');
        return;
      }

      if (this.nuevoMedico.password !== this.nuevoMedico.confirmarPassword) {
        await this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
        return;
      }

      const medicos = await this.jsonStorage.getData('medicosRegistrados') || [];
      
      // Verificar si el email ya existe
      const medicoExistente = medicos.find((medico: any) => medico.email === this.nuevoMedico.email);
      if (medicoExistente) {
        await this.mostrarAlerta('Error', 'Este email ya está registrado');
        return;
      }

      const nuevoMedico = {
        id: Date.now().toString(),
        nombre: this.nuevoMedico.nombre,
        email: this.nuevoMedico.email,
        password: this.nuevoMedico.password,
        especialidad: this.nuevoMedico.especialidad,
        matricula: this.nuevoMedico.matricula,
        telefono: this.nuevoMedico.telefono,
        hospital: this.nuevoMedico.hospital,
        tipo: 'medico',
        activo: true,
        fechaRegistro: new Date().toISOString()
      };

      medicos.push(nuevoMedico);
      await this.jsonStorage.saveData('medicosRegistrados', medicos);

      await this.mostrarAlerta('Éxito', 'Registro completado. Ahora puedes iniciar sesión.');
      this.modo = 'login'; // Cambiar a modo login
      
      // Limpiar formulario
      this.nuevoMedico = {
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: '',
        especialidad: '',
        matricula: '',
        telefono: '',
        hospital: ''
      };

    } catch (error) {
      console.error('Error registrando médico:', error);
      await this.mostrarAlerta('Error', 'Error al registrar médico');
    }
  }

  // Crear cuenta de prueba (médico pre-registrado)
  async crearCuentaPrueba() {
    const medicoPrueba = {
      id: 'medico-prueba',
      nombre: 'Dr. Pedro Pérez',
      email: 'medico@test.com',
      password: '123456',
      especialidad: 'Ginecología',
      matricula: 'MG-12345',
      telefono: '123456789',
      hospital: 'Hospital Central',
      tipo: 'medico',
      activo: true,
      fechaRegistro: new Date().toISOString()
    };

    const medicos = await this.jsonStorage.getData('medicosRegistrados') || [];
    
    // Verificar si ya existe
    const existe = medicos.find((m: any) => m.email === 'medico@test.com');
    if (!existe) {
      medicos.push(medicoPrueba);
      await this.jsonStorage.saveData('medicosRegistrados', medicos);
    }

    // Autocompletar credenciales
    this.credenciales.email = 'medico@test.com';
    this.credenciales.password = '123456';

    await this.mostrarAlerta('Cuenta de Prueba', 'Credenciales cargadas: medico@test.com / 123456');
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  irARegistroMadre() {
    this.router.navigate(['/registro-madre']);
  }
}
