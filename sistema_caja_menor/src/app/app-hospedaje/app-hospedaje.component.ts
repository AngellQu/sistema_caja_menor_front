import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AppOperationComponent } from '../app-operation/app-operation.component';
import { TableModule } from 'primeng/table';
import { Hospedaje } from '../models/Hospedaje';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { HospedajeService } from '../services/hospedaje.service';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-app-hospedaje',
  standalone: true,
  imports: [
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    HttpClientModule,
    AppOperationComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    CalendarModule
  ],
  providers: [HospedajeService, MessageService, ConfirmationService],
  templateUrl: './app-hospedaje.component.html',
  styleUrls: ['./app-hospedaje.component.css']
})

export class AppHospedajeComponent {
  id?: string;
  idHuesped = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  habitacion = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  fechaIngreso = new FormControl('', [Validators.required]);
  fechaSalida = new FormControl('', [Validators.required, this.fechaSalidaValida.bind(this)]);

  hospedajes: Hospedaje[] = [];
  selectedHospedajes: Hospedaje[] = [];
  isVisible: boolean = false;
  isVisibleUpdate: boolean = false;

  constructor(private hospedajeService: HospedajeService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  editHospedaje(hospedaje: Hospedaje) {
    this.selectedHospedajes = [hospedaje];
    this.id = hospedaje.id;
    this.idHuesped.setValue(hospedaje.idHuesped);
    this.habitacion.setValue(hospedaje.habitacion);
    this.fechaIngreso.setValue(hospedaje.fechaIngreso);
    this.fechaSalida.setValue(hospedaje.fechaSalida);
    this.isVisibleUpdate = true;
  }

  ngOnInit(){
    this.getHospedajeByIdHuesped(null);
  }

  createHospedaje() {
    if (this.idHuesped.valid && this.habitacion.valid && this.fechaIngreso.valid && this.fechaSalida.valid) {
      const formattedFechaIngreso = this.formatFecha(this.fechaIngreso.value);
      const formattedFechaSalida = this.formatFecha(this.fechaSalida.value);
      const nuevoHospedaje = new Hospedaje(
        this.idHuesped.value ?? '',
        this.habitacion.value ?? '',
        formattedFechaIngreso,
        formattedFechaSalida
      );
      this.hospedajeService.create(nuevoHospedaje).subscribe({
        next: () => {
          this.hospedajeService.getByIdHuesped(nuevoHospedaje.idHuesped).subscribe((hospedajes: any[]) => {
            if (hospedajes.length > 0) {
              const hospedajesMapeados = hospedajes.map(hospedaje => ({
                id: hospedaje.id,
                idHuesped: hospedaje.id_huesped,
                habitacion: hospedaje.habitacion,
                fechaIngreso: new Date(hospedaje.fecha_ingreso).toLocaleDateString(),
                fechaSalida: new Date(hospedaje.fecha_salida).toLocaleDateString(),
              }));
              const ultimoHospedaje = hospedajesMapeados[0];
              this.hospedajes.unshift(ultimoHospedaje);
              this.cancelRecord();
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Hospedaje creado correctamente.' });
            }
          });
        },
        error: (err) => {
          console.error('Error al crear el hospedaje:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Ocurrió un error al crear el hospedaje: ${err.message || 'Error desconocido'}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Formulario incompleto', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }
    
  getHospedajeByIdHuesped(idHuesped: string | null): void {
    this.hospedajeService.getByIdHuesped(idHuesped).subscribe({
      next: (response: any[]) => {
        this.hospedajes = response.map(hospedaje => ({
          id: hospedaje.id,
          idHuesped: hospedaje.id_huesped,
          habitacion: hospedaje.habitacion,
          fechaIngreso: new Date(hospedaje.fecha_ingreso).toLocaleDateString(),
          fechaSalida: new Date(hospedaje.fecha_salida).toLocaleDateString(),
        }));
      },
      error: (err) => {
        console.error('Error al buscar hospedaje:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró ningún hospedaje con ese ID de huésped.' });
      },
    });
  }

  deleteHospedaje() {
    if (this.selectedHospedajes.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Sin selección', detail: 'No hay hospedajes seleccionados para eliminar.' });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar el hospedaje seleccionado?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedHospedajes.forEach((hospedaje) => {
          this.hospedajeService.deleteById(hospedaje.id!).subscribe({
            next: () => {
              this.hospedajes = this.hospedajes.filter((h) => h.id !== hospedaje.id);
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Hospedaje con ID ${hospedaje.id} eliminado correctamente.` });
            },
            error: (err) => {
              console.error(`Error al eliminar hospedaje con ID ${hospedaje.id}:`, err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo eliminar el hospedaje con ID ${hospedaje.id}.` });
            },
          });
        });
        this.selectedHospedajes = [];
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La eliminación fue cancelada.' });
      }
    });
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.hospedajes);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hospedajes');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.downloadExcelFile(excelBuffer, 'Hospedajes');
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

  private formatFecha(fecha: any): string {
    const date = new Date(fecha);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  }

  private formatFechaTable(fecha: string | Date): string {
    let date = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }
  
  updateHospedaje() {
    if (this.idHuesped.valid && this.habitacion.valid && this.fechaIngreso.valid && this.fechaSalida.valid) {
      const formattedFechaIngreso = this.formatFecha(this.fechaIngreso.value);
      const formattedFechaSalida = this.formatFecha(this.fechaSalida.value);
  
      const updatedHospedaje = new Hospedaje(
        this.idHuesped.value ?? '',
        this.habitacion.value ?? '',
        formattedFechaIngreso,
        formattedFechaSalida,
        this.id
      );
  
      this.hospedajeService.update(updatedHospedaje).subscribe({
        next: () => {
          const index = this.hospedajes.findIndex(h => h.id === this.id);
  
          if (index !== -1) {
            this.hospedajes[index] = {
              id: updatedHospedaje.id,
              idHuesped: updatedHospedaje.idHuesped,
              habitacion: updatedHospedaje.habitacion,
              fechaIngreso: this.formatFechaTable(updatedHospedaje.fechaIngreso),
              fechaSalida: this.formatFechaTable(updatedHospedaje.fechaSalida)
            };
  
            this.cancelRecord();
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Hospedaje actualizado correctamente.' });
          }
        },
        error: (err) => {
          console.error('Error al actualizar hospedaje:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el hospedaje.' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Completa correctamente los campos del formulario.' });
    }
  }
  
  private fechaSalidaValida(control: AbstractControl): ValidationErrors | null {
    if (this.fechaIngreso && this.fechaIngreso.value && control.value) {
      const fechaIngreso = new Date(this.fechaIngreso.value);
      const fechaSalida = new Date(control.value);
      if (fechaIngreso > fechaSalida) {
        return { fechaSalidaInvalida: true };
      }
    }
    return null;
  }

  cancelRecord() {
    this.isVisible = false;
    this.isVisibleUpdate = false;
    this.idHuesped.reset();
    this.habitacion.reset();
    this.fechaIngreso.reset();
    this.fechaSalida.reset();
    this.selectedHospedajes = [];
  }
}
