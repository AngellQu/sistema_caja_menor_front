import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AppOperationComponent } from '../app-operation/app-operation.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Producto } from '../models/Producto';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductoService } from '../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-app-producto',
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
  providers: [ProductoService, MessageService, ConfirmationService],
  templateUrl: './app-producto.component.html',
  styleUrl: './app-producto.component.css'
})

export class AppProductoComponent {
  id = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  nombre = new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]);
  precio = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);

  productos: Producto[] = [];
  selectedProductos: Producto[] = [];
  isVisible: boolean = false;
  isVisibleUpdate: boolean = false;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  editProducto(producto: any) {
    this.selectedProductos = [producto];
    this.id.setValue(producto.id);
    this.nombre.setValue(producto.nombre);
    this.precio.setValue(producto.precio);
    this.isVisibleUpdate = true;
  }

  ngOnInit(){
    this.getProductoByIdOrNombre(null);
  }

  createProducto() {
    if (this.id.valid && this.nombre.valid && this.precio.valid) {
      const producto: Producto = {
        id: this.id.value ?? '',
        nombre: this.nombre.value ?? '',
        precio: this.precio.value ?? ''
      };
      this.productoService.create(producto).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado con éxito' });
          this.productos.unshift(producto);
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

  getProductoByIdOrNombre(filter: string | null): void {
    this.productoService.getByIdOrNombre(filter).subscribe({
      next: (response: Producto[]) => {
        this.productos = response;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró ningún producto con ese ID.' });
      }
    });
  }

  deleteProducto() {
    if (this.selectedProductos.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay productos seleccionados para eliminar.' });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar los productos seleccionados?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedProductos.forEach((producto) => {
          this.productoService.deleteById(producto.id).subscribe({
            next: () => {
              this.productos = this.productos.filter((p) => p.id !== producto.id);
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Producto con ID ${producto.id} eliminado.` });
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo eliminar el producto con ID ${producto.id}.` });
            }
          });
        });
        this.selectedProductos = [];
      }
    });
  }

  updateProducto() {
    if (this.id.valid && this.nombre.valid && this.precio.valid) {
      const updatedProducto: Producto = {
        id: this.id.value ?? '',
        nombre: this.nombre.value ?? '',
        precio: this.precio.value ?? ''
      };
      this.productoService.update(updatedProducto).subscribe({
        next: () => {
          const index = this.productos.findIndex(p => p.id === updatedProducto.id);
          if (index !== -1) {
            this.productos[index] = updatedProducto;
          }
          this.cancelRecord();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado con éxito.' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo actualizar el producto. Error: ${err.message || 'desconocido'}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa correctamente los campos del formulario.' });
    }
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.productos);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.downloadExcelFile(excelBuffer, 'Productos');
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
    this.precio.reset();
  }
}
