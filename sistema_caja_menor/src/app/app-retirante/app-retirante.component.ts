import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AppOperationComponent } from '../app-operation/app-operation.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Retirante } from '../models/Retirante';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RetiranteService } from '../services/retirante.service';
import { DialogModule } from 'primeng/dialog';
import * as XLSX from 'xlsx';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-app-retirante',
  standalone: true,
  imports: [AppOperationComponent,
    HttpClientModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule],
  providers:[RetiranteService, MessageService, ConfirmationService],
  templateUrl: './app-retirante.component.html',
  styleUrl: './app-retirante.component.css'
})

export class AppRetiranteComponent {
  id = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  nombre = new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]);
  telefono = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  direccion = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s#,\-\.]+$/)]);
  
  retirantes: Retirante[] = [];
  selectedRetirantes: Retirante[] = [];
  isVisible: boolean = false;
  isVisibleUpdate: boolean = false;
  
  constructor(
    private retiranteService: RetiranteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  editRetirante(retirante: any) {
    this.selectedRetirantes = [retirante];
    this.id.setValue(retirante.id);
    this.nombre.setValue(retirante.nombre);
    this.telefono.setValue(retirante.telefono);
    this.direccion.setValue(retirante.direccion);
    this.isVisibleUpdate = true;
  }

  ngOnInit(){
    this.getRetiranteByIdOrNombre(null);
  }

  createRetirante() {
    if (this.id.valid && this.nombre.valid && this.telefono.valid && this.direccion.valid) {
      const retirante: Retirante = {
        id: this.id.value ?? '',
        nombre: this.nombre.value ?? '',
        telefono: this.telefono.value ?? '',
        direccion: this.direccion.value ?? ''
      };
      this.retiranteService.create(retirante).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Retirante creado con éxito' });
          this.retirantes.unshift(retirante);
          this.cancelRecord();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Ocurrió un error: ${err.message || 'Error desconocido'}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }

  getRetiranteByIdOrNombre(filter: string | null): void {
    this.retiranteService.getByIdOrNombre(filter).subscribe({
      next: (response: Retirante[]) => {
        this.retirantes = response;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró ningún retirante con ese ID o nombre.' });
      }
    });
  }

  deleteRetirante() {
    if (this.selectedRetirantes.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay retirantes seleccionados para eliminar.' });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar los retirantes seleccionados?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedRetirantes.forEach((retirante) => {
          this.retiranteService.deleteById(retirante.id).subscribe({
            next: () => {
              this.retirantes = this.retirantes.filter((r) => r.id !== retirante.id);
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Retirante con ID ${retirante.id} eliminado.` });
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo eliminar el retirante con ID ${retirante.id}.` });
            }
          });
        });
        this.selectedRetirantes = [];
      }
    });
  }

  updateRetirante() {
    if (this.id.valid && this.nombre.valid && this.telefono.valid && this.direccion.valid) {
      const updatedRetirante: Retirante = {
        id: this.id.value ?? '',
        nombre: this.nombre.value ?? '',
        telefono: this.telefono.value ?? '',
        direccion: this.direccion.value ?? ''
      };
      this.retiranteService.update(updatedRetirante).subscribe({
        next: () => {
          const index = this.retirantes.findIndex(r => r.id === updatedRetirante.id);
          if (index !== -1) {
            this.retirantes[index] = updatedRetirante;
          }
          this.cancelRecord();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Retirante actualizado con éxito.' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo actualizar el retirante. Error: ${err.message || 'desconocido'}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.retirantes);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Retirantes');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.downloadExcelFile(excelBuffer, 'Retirantes');
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

  cancelRecord() {
    this.isVisible = false;
    this.isVisibleUpdate = false;
    this.id.reset();
    this.nombre.reset();
    this.telefono.reset();
    this.direccion.reset();
  }
}
