import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonList
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { JsonStorageService } from '../services/json-storage.service';

@Component({
  selector: 'app-herramientas-medicas',
  templateUrl: './herramientas-medicas.page.html',
  styleUrls: ['./herramientas-medicas.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton,
    IonGrid, IonRow, IonCol, IonList,
    CommonModule, FormsModule
  ]
})
export class HerramientasMedicasPage {
  // Para cálculo de FPP
  fum: string = '';
  fppResultado: string = '';
  semanasEmbarazo: number = 0;
  
  // Para cálculo de IMC
  peso: number = 0;
  altura: number = 0;
  imcResultado: number = 0;
  clasificacionIMC: string = '';
  
  // Tablas de referencia
  tablaPresionArterial = [
    { categoria: 'Normal', sistolica: '< 120', diastolica: '< 80' },
    { categoria: 'Elevada', sistolica: '120-129', diastolica: '< 80' },
    { categoria: 'Hipertensión Etapa 1', sistolica: '130-139', diastolica: '80-89' },
    { categoria: 'Hipertensión Etapa 2', sistolica: '≥ 140', diastolica: '≥ 90' }
  ];
  
  tablaGananciaPeso = [
    { imcInicial: '< 18.5 (Bajo peso)', gananciaRecomendada: '12.5 - 18 kg' },
    { imcInicial: '18.5 - 24.9 (Normal)', gananciaRecomendada: '11.5 - 16 kg' },
    { imcInicial: '25 - 29.9 (Sobrepeso)', gananciaRecomendada: '7 - 11.5 kg' },
    { imcInicial: '≥ 30 (Obesidad)', gananciaRecomendada: '5 - 9 kg' }
  ];

  constructor(
    private alertController: AlertController,
    private jsonStorage: JsonStorageService
  ) {}

  // MÉTODO QUE FALTABA - Color para el card del IMC
  getColorIMC(): string {
    if (this.imcResultado === 0) return 'light';
    if (this.imcResultado < 18.5) return 'warning';
    if (this.imcResultado < 25) return 'success';
    if (this.imcResultado < 30) return 'warning';
    return 'danger';
  }

  // CALCULAR FPP (Fecha Probable de Parto)
  calcularFPP() {
    if (!this.fum) {
      this.mostrarAlerta('Error', 'Ingresa la fecha de tu última menstruación');
      return;
    }

    const fumDate = new Date(this.fum);
    
    // Validar fecha
    if (isNaN(fumDate.getTime())) {
      this.mostrarAlerta('Error', 'Fecha inválida');
      return;
    }

    // Calcular FPP: FUM + 280 días (40 semanas)
    const fppDate = new Date(fumDate);
    fppDate.setDate(fumDate.getDate() + 280);
    
    // Calcular semanas de embarazo
    const hoy = new Date();
    const diferenciaMs = hoy.getTime() - fumDate.getTime();
    this.semanasEmbarazo = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24 * 7));
    
    // Formatear resultados
    this.fppResultado = fppDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Guardar en almacenamiento
    this.guardarCalculoFPP();
    
    this.mostrarAlerta('Cálculo completado', 
      `Tu FPP es: ${this.fppResultado}\nSemanas de embarazo: ${this.semanasEmbarazo}`);
  }

  // CALCULAR IMC
  calcularIMC() {
    if (!this.peso || !this.altura) {
      this.mostrarAlerta('Error', 'Ingresa peso y altura');
      return;
    }

    if (this.altura <= 0) {
      this.mostrarAlerta('Error', 'La altura debe ser mayor a 0');
      return;
    }

    // Calcular IMC: peso / (altura * altura)
    const alturaMetros = this.altura / 100;
    this.imcResultado = this.peso / (alturaMetros * alturaMetros);
    
    // Determinar clasificación
    if (this.imcResultado < 18.5) {
      this.clasificacionIMC = 'Bajo peso';
    } else if (this.imcResultado < 25) {
      this.clasificacionIMC = 'Peso normal';
    } else if (this.imcResultado < 30) {
      this.clasificacionIMC = 'Sobrepeso';
    } else {
      this.clasificacionIMC = 'Obesidad';
    }

    // Guardar en almacenamiento
    this.guardarCalculoIMC();
    
    this.mostrarAlerta('IMC Calculado', 
      `Tu IMC es: ${this.imcResultado.toFixed(1)}\nClasificación: ${this.clasificacionIMC}`);
  }

  // GUARDAR CÁLCULOS EN JSON
  async guardarCalculoFPP() {
    try {
      const calculos = await this.jsonStorage.getData('calculosMedicos') || {};
      
      calculos.fpp = {
        fum: this.fum,
        fppResultado: this.fppResultado,
        semanasEmbarazo: this.semanasEmbarazo,
        fechaCalculo: new Date().toISOString()
      };
      
      await this.jsonStorage.saveData('calculosMedicos', calculos);
    } catch (error) {
      console.error('Error guardando cálculo FPP:', error);
    }
  }

  async guardarCalculoIMC() {
    try {
      const calculos = await this.jsonStorage.getData('calculosMedicos') || {};
      
      calculos.imc = {
        peso: this.peso,
        altura: this.altura,
        imcResultado: this.imcResultado,
        clasificacion: this.clasificacionIMC,
        fechaCalculo: new Date().toISOString()
      };
      
      await this.jsonStorage.saveData('calculosMedicos', calculos);
    } catch (error) {
      console.error('Error guardando cálculo IMC:', error);
    }
  }

  // CARGAR CÁLCULOS PREVIOS
  async cargarCalculosPrevios() {
    try {
      const calculos = await this.jsonStorage.getData('calculosMedicos');
      
      if (calculos?.fpp) {
        this.fum = calculos.fpp.fum;
        this.fppResultado = calculos.fpp.fppResultado;
        this.semanasEmbarazo = calculos.fpp.semanasEmbarazo;
      }
      
      if (calculos?.imc) {
        this.peso = calculos.imc.peso;
        this.altura = calculos.imc.altura;
        this.imcResultado = calculos.imc.imcResultado;
        this.clasificacionIMC = calculos.imc.clasificacion;
      }
      
    } catch (error) {
      console.error('Error cargando cálculos previos:', error);
    }
  }

  // LIMPIAR FORMULARIOS
  limpiarFPP() {
    this.fum = '';
    this.fppResultado = '';
    this.semanasEmbarazo = 0;
  }

  limpiarIMC() {
    this.peso = 0;
    this.altura = 0;
    this.imcResultado = 0;
    this.clasificacionIMC = '';
  }

  // MÉTODO PARA CARGAR DATOS DE PRUEBA
  cargarDatosPrueba() {
    // Datos de prueba para FPP
    const fechaPrueba = new Date();
    fechaPrueba.setDate(fechaPrueba.getDate() - 12 * 7); // 12 semanas atrás
    this.fum = fechaPrueba.toISOString().split('T')[0];
    
    // Datos de prueba para IMC
    this.peso = 65;
    this.altura = 165;
    
    this.mostrarAlerta('Datos de prueba', 'Datos de prueba cargados. Ahora puedes calcular.');
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Cargar datos al inicializar
  async ngOnInit() {
    await this.cargarCalculosPrevios();
  }
}
