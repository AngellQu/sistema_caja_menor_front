import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AppOperationComponent } from '../app-operation/app-operation.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Retiro } from '../models/Retiro';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RetiroService } from '../services/retiro.service';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { AppInicioComponent } from '../app-inicio/app-inicio.component';
import * as XLSX from 'xlsx';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-app-retiro',
  standalone: true,
  imports: [AppOperationComponent,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    HttpClientModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule],
  providers: [AppInicioComponent, RetiroService, MessageService, ConfirmationService],
  templateUrl: './app-retiro.component.html',
  styleUrl: './app-retiro.component.css'
})

export class AppRetiroComponent {
  idRetirante = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  descripcion = new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]);
  monto = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);

  retiro: Retiro[] = [];
  isVisible: boolean = false;

  constructor(
    private retiroService: RetiroService,
    private appInicio: AppInicioComponent,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getRetiroByIdRetiranteOrFecha(null);
  }

  createRetiro() {
    if (this.idRetirante.valid && this.descripcion.valid && this.monto.valid) {
      const nuevoRetiro = new Retiro(
        this.idRetirante.value ?? '',
        this.descripcion.value ?? '',
        this.monto.value ?? ''
      );
      this.retiroService.create(nuevoRetiro).subscribe({
        next: (response: any) => {
          this.appInicio.setSaldo(response[0].saldo_actual.toString());
          this.retiroService.getByIdRetiranteOrFecha(nuevoRetiro.idRetirante).subscribe((retiros: any[]) => {
            if (retiros.length > 0) {
              const retirosMapeados = retiros.map(retiro => ({
                idRetirante: retiro.id_retirante,
                descripcion: retiro.descripcion,
                idRecepcionista: retiro.id_recepcionista,
                monto: retiro.monto,
                fecha: this.formatFechaTable(retiro.fecha!),
              }));
              const ultimoRetiro = retirosMapeados[0];
              this.retiro.unshift(ultimoRetiro);
              this.cancelRecord();
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Retiro creado correctamente' });
            }
          });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al crear el retiro: ${err.message || 'Error desconocido'}` });
        },
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario' });
    }
  }

  getRetiroByIdRetiranteOrFecha(filter: string | null): void {
    this.retiroService.getByIdRetiranteOrFecha(filter).subscribe({
      next: (response: any[]) => {
        this.retiro = response.map(retiro => ({
          idRetirante: retiro.id_retirante,
          idRecepcionista: retiro.id_recepcionista,
          descripcion: retiro.descripcion,
          monto: retiro.monto,
          fecha: this.formatFechaTable(retiro.fecha!),
        }));
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró ningún retiro con ese ID de retirante' });
      },
    });
  }

  deleteRetiro() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar los retiros seleccionados?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.retiroService.deleteByIdRecepcionista().subscribe({
          next: (response: any) => {
            this.getRetiroByIdRetiranteOrFecha(null);
            this.appInicio.setSaldo(response[0].saldo.toString());
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Retiro eliminado correctamente' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el retiro' });
          },
        });
      }
    });
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.retiro);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Retiros');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.downloadExcelFile(excelBuffer, 'Retiros');
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
    this.idRetirante.reset();
    this.descripcion.reset();
    this.monto.reset();
  }
}
