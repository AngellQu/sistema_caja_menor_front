import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AppOperationComponent } from '../app-operation/app-operation.component';
import { TableModule } from 'primeng/table';
import { Huesped } from '../models/Huesped';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { HuespedService } from '../services/huesped.service';
import { HttpClientModule } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { StdioNull } from 'child_process';

@Component({
  selector: 'app-app-huesped',
  standalone: true,
  imports: [AppOperationComponent,
    ToastModule,
    ConfirmDialogModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule],
  providers: [HuespedService, MessageService, ConfirmationService],
  templateUrl: './app-huesped.component.html',
  styleUrl: './app-huesped.component.css'
})

export class AppHuespedComponent {
  cedula = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  nombre = new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]);
  telefono = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);

  huespedes: Huesped[] = [];
  selectedHuespedes: Huesped[] = [];
  isVisible: boolean = false;
  isVisibleUpdate: boolean = false;

  constructor(private huespedService: HuespedService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  editHuesped(huesped: any) {
    this.selectedHuespedes = [huesped];
    this.cedula.setValue(huesped.cedula);
    this.nombre.setValue(huesped.nombre);
    this.telefono.setValue(huesped.telefono);
    this.isVisibleUpdate = true;
  }

  ngOnInit(){
    this.getHuespedByCedulaOrName(null);
  }

  createHuesped() {
    if (this.cedula.valid && this.nombre.valid && this.telefono.valid) {
      const huesped = new Huesped(
        this.cedula.value ?? '',
        this.nombre.value ?? '',
        this.telefono.value ?? ''
      );
      this.huespedService.create(huesped).subscribe({
        next: () => {
          this.huespedes.unshift(huesped);
          this.cancelRecord();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Huésped creado con éxito.' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Ocurrió un error: ${err.message || 'Error desconocido'}` });
        },
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }

  getHuespedByCedulaOrName(filter: string | null): void {
    this.huespedService.getByCedulaOrName(filter).subscribe({
      next: (response: Huesped[]) => {
        this.huespedes = response;
      },
      error: (err) => {
        console.error('Error al buscar huésped:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró ningún huésped con ese filtro.' });
      },
    });
  }

  deleteHuesped() {
    if (this.selectedHuespedes.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay huéspedes seleccionados para eliminar.' });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar el huésped seleccionado?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedHuespedes.forEach((huesped) => {
          this.huespedService.deleteByCedula(huesped.cedula).subscribe({
            next: (response) => {
              this.huespedes = this.huespedes.filter((h) => h.cedula !== huesped.cedula);
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Huésped con cédula ${huesped.cedula} eliminado.` });
            },
            error: (err) => {
              console.error(`Error al eliminar huésped con cédula ${huesped.cedula}:`, err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo eliminar el huésped con cédula ${huesped.cedula}.` });
            }
          });
        });
        this.selectedHuespedes = [];
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La eliminación fue cancelada.' });
      }
    });
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.huespedes);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Huespedes');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.downloadExcelFile(excelBuffer, 'Huespedes');
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

  updateHuesped() {
    if (this.cedula.valid && this.nombre.valid && this.telefono.valid) {
      const updatedHuesped = new Huesped(
        this.cedula.value ?? '',
        this.nombre.value ?? '',
        this.telefono.value ?? ''
      );
      this.huespedService.update(updatedHuesped).subscribe({
        next: () => {
          const index = this.huespedes.findIndex(h => h.cedula === updatedHuesped.cedula);
          if (index !== -1) {
            this.huespedes[index] = updatedHuesped;
          }
          this.cancelRecord();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Huésped actualizado con éxito.' });
        },
        error: (err) => {
          console.error(`Error al actualizar huésped con cédula ${updatedHuesped.cedula}:`, err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo actualizar el huésped. Error: ${err.message || 'desconocido'}` });
        },
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }

  cancelRecord() {
    this.isVisible = false;
    this.isVisibleUpdate = false;
    this.selectedHuespedes = [];
    this.nombre.reset();
    this.cedula.reset();
    this.telefono.reset();
  }
}
