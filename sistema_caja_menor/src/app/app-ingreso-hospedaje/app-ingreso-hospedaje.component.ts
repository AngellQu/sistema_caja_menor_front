import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AppOperationComponent } from '../app-operation/app-operation.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IngresoHospedaje } from '../models/IngresoHospedaje';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { IngresoHospedajeService } from '../services/ingreso-hospedaje.service';
import { HttpClientModule } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { AppInicioComponent } from '../app-inicio/app-inicio.component';
import { MessageService, ConfirmationService } from 'primeng/api';  // Importar el servicio de mensajes
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-app-ingreso-hospedaje',
  standalone: true,
  imports: [AppOperationComponent,
    ToastModule,
    ConfirmDialogModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule],
  providers: [IngresoHospedajeService, AppInicioComponent, MessageService, ConfirmationService],
  templateUrl: './app-ingreso-hospedaje.component.html',
  styleUrls: ['./app-ingreso-hospedaje.component.css']
})

export class AppIngresoHospedajeComponent {
  idHospedaje = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  metodoPago?: string;
  monto = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  opcionesMetodosPago = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Transacción', value: 'transaccion' },
    { label: 'Tarjeta', value: 'tarjeta' },
    { label: 'QR', value: 'qr' }
  ];

  ingresoHospedajes: IngresoHospedaje[] = [];
  isVisible: boolean = false;

  constructor(private ingresoHospedajeService: IngresoHospedajeService, private appInicio: AppInicioComponent, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getIngresoHospedajeByIdHospedajeOrFecha(null);
  }

  createIngresoHospedaje() {
    if (this.idHospedaje.valid && this.metodoPago && this.monto.valid) {
      const nuevoIngreso = new IngresoHospedaje(
        this.idHospedaje.value ?? '',
        this.metodoPago ?? '',
        this.monto.value ?? '0'
      );
      this.ingresoHospedajeService.create(nuevoIngreso).subscribe({
        next: (response: any) => {
          this.appInicio.setSaldo(response[0].saldo_actual.toString());
          this.ingresoHospedajeService.getByIdHospedaje(nuevoIngreso.idHospedaje).subscribe((ingresosHospedajes: any[]) => {
            if (ingresosHospedajes.length > 0) {
              const IngresoshospedajesMapeados = ingresosHospedajes.map(ingreso => ({
                idRecepcionista: ingreso.id_recepcionista,
                idHospedaje: ingreso.id_hospedaje,
                metodoPago: ingreso.metodo_pago,
                monto: ingreso.monto,
                fecha: this.formatFechaTable(ingreso.fecha!)
              }));
              const ultimoHospedaje = IngresoshospedajesMapeados[0];
              this.ingresoHospedajes.unshift(ultimoHospedaje);
              this.cancelRecord();
            }
          });
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ingreso de hospedaje creado correctamente' });
        },
        error: (err) => {
          console.error('Error al crear el ingreso de hospedaje:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Ocurrió un error al crear el ingreso de hospedaje: ${err.message || 'Error desconocido'}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }

  getIngresoHospedajeByIdHospedajeOrFecha(filter: string | null): void {
    this.ingresoHospedajeService.getByIdHospedaje(filter).subscribe({
      next: (response: any[]) => {
        this.ingresoHospedajes = response.map(ingreso => ({
          idRecepcionista: ingreso.id_recepcionista,
          idHospedaje: ingreso.id_hospedaje,
          metodoPago: ingreso.metodo_pago,
          monto: ingreso.monto,
          fecha: this.formatFechaTable(ingreso.fecha!)
        }));
      },
      error: (err) => {
        console.error('Error al buscar ingreso de hospedaje:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró ningún ingreso de hospedaje con ese ID de hospedaje.' });
      },
    });
  }

  deleteIngresoHospedaje() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar el ingreso hospedaje?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ingresoHospedajeService.deleteByIdRecepcionista().subscribe({
          next: (response: any) => {
            this.getIngresoHospedajeByIdHospedajeOrFecha(null);
            this.appInicio.setSaldo(response[0].saldo.toString());
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El ingreso se eliminó exitosamente.' });
          },
          error: (err) => {
            console.error('Error al eliminar ingreso.', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el ingreso.' });
          },
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La eliminación fue cancelada.' });
      }
    });
  }
  

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ingresoHospedajes);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ingreso Hospedajes');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.downloadExcelFile(excelBuffer, 'Ingresos Hospedajes');
  }

  private downloadExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${new Date().getTime()}.xlsx`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  private formatFechaTable(fecha: string | Date): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  cancelRecord() {
    this.isVisible = false;
    this.metodoPago = undefined;
    this.monto.reset();
    this.idHospedaje.reset();
  }
}
