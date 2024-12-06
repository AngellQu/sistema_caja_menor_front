import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AppOperationComponent } from '../app-operation/app-operation.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IngresoProducto } from '../models/IngresoProducto';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { IngresoProductoService } from '../services/ingreso-producto.service';
import * as XLSX from 'xlsx';
import { AppInicioComponent } from '../app-inicio/app-inicio.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-app-ingreso-producto',
  standalone: true,
  imports: [AppOperationComponent,
    ConfirmDialogModule,
    ToastModule,
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
  providers: [AppInicioComponent, IngresoProductoService, MessageService, ConfirmationService],
  templateUrl: './app-ingreso-producto.component.html',
  styleUrl: './app-ingreso-producto.component.css'
})

export class AppIngresoProductoComponent {
  nombre = new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]);
  cantidad = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  metodoPago?: string;
  idHuesped = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)])
  opcionesMetodosPago = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Transacción', value: 'transaccion' },
    { label: 'Tarjeta', value: 'tarjeta' },
    { label: 'QR', value: 'qr' }
  ];

  ingresoProductos: IngresoProducto[] = [];
  isVisible: boolean = false;

  constructor(
    private ingresoProductoService: IngresoProductoService,
    private appInicio: AppInicioComponent,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getIngresoProductoByIdHuespedOrFecha(null);
  }

  createIngresoProducto() {
    if (this.idHuesped.valid && this.nombre.valid && this.cantidad.valid) {
      const nuevoIngreso = new IngresoProducto(
        this.nombre.value ?? '',
        this.cantidad.value ?? '',
        this.metodoPago ?? '',
        this.idHuesped.value ?? ''
      );
      this.ingresoProductoService.create(nuevoIngreso).subscribe({
        next: (response: any) => {
          this.appInicio.setSaldo(response[0].saldo_actual.toString());
          this.ingresoProductoService.getByIdHuespedOrFecha(nuevoIngreso.idHuesped).subscribe((ingresosProductos: any[]) => {
            if (ingresosProductos.length > 0) {
              const ingresosProductosMapeados = ingresosProductos.map(ingreso => ({
                idRecepcionista: ingreso.id_recepcionista,
                idHuesped: ingreso.id_huesped,
                idProducto: ingreso.id_producto,
                metodoPago: ingreso.metodo_pago,
                monto: ingreso.monto,
                cantidad: ingreso.cantidad,
                fecha: this.formatFechaTable(ingreso.fecha!),
                nombre: ingreso.nombre,
              }));
              const ultimoProducto = ingresosProductosMapeados[0];
              this.ingresoProductos.unshift(ultimoProducto);
              this.cancelRecord();
            }
          });
        },
        error: (err) => {
          console.error('Error al crear el ingreso de producto:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Ocurrió un error al crear el ingreso de producto: ${err.message || 'Error desconocido'}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }

  getIngresoProductoByIdHuespedOrFecha(filter: string | null): void {
    this.ingresoProductoService.getByIdHuespedOrFecha(filter).subscribe({
      next: (response: any[]) => {
        this.ingresoProductos = response.map(ingreso => ({
          idRecepcionista: ingreso.id_recepcionista,
          idHuesped: ingreso.id_huesped,
          idProducto: ingreso.id_producto,
          metodoPago: ingreso.metodo_pago,
          monto: ingreso.monto,
          cantidad: ingreso.cantidad,
          fecha: this.formatFechaTable(ingreso.fecha!),
          nombre: ingreso.nombre,
        }));
      },
      error: (err) => {
        console.error('Error al buscar ingreso de producto:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró ningún ingreso de producto con ese ID de huésped.' });
      },
    });
  }

  deleteIngresoProducto() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar los ingresos de producto seleccionados?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ingresoProductoService.deleteByIdRecepcionista().subscribe({
          next: (response: any) => {
            this.getIngresoProductoByIdHuespedOrFecha(null);
            this.appInicio.setSaldo(response[0].saldo.toString());
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El ingreso de producto se eliminó exitosamente.' });
          },
          error: (err) => {
            console.error(`Error al eliminar ingreso producto.`, err);
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
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ingresoProductos);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ingreso Hospedajes');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.downloadExcelFile(excelBuffer, 'Ingresos Productos');
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
    this.nombre.reset();
    this.cantidad.reset();
    this.idHuesped.reset();
    this.metodoPago = undefined;
  }
}
