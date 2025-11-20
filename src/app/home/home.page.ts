import { Component, OnInit } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { JsonStorageService } from '../services/json-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, RouterLink]
})
export class HomePage implements OnInit {
  
  constructor(private jsonStorage: JsonStorageService) {}

  ngOnInit() {
    this.testStorage();
  }

  async testStorage() {
    try {
      console.log('🧪 Probando almacenamiento JSON...');
      
      // Guardar datos de prueba
      await this.jsonStorage.saveData('test', { 
        mensaje: '¡Funciona!', 
        fecha: new Date().toISOString() 
      });
      
      // Leer datos de prueba
      const datos = await this.jsonStorage.getData('test');
      console.log('📦 Datos de prueba leídos:', datos);
      
      // Mostrar todos los datos
      await this.jsonStorage.debugShowData();
      
    } catch (error) {
      console.error('❌ Error en test:', error);
    }
  }
}
