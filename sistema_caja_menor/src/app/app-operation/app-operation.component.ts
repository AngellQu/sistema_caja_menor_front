import { Component, Output, EventEmitter } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-app-operation',
  standalone: true,
  imports: [InputTextModule, ButtonModule],
  template: `
      <div>
        <input type="text" pInputText #inputText placeholder="Buscar" [style]="{
          'border-radius': '5px 0px 0px 5px',
          'border-color': 'white',
          'margin-left': '50px'
        }"/>
        <p-button (onClick)="onSearch(inputText.value)" icon="pi pi-search" [style]="{
          'background-color': 'white',
          'border-color': 'white',
          'margin-left': '1px',
          'color': 'black',
          'border-radius': '0px 5px 5px 0px'
        }"></p-button>
        <p-button (onClick)="onAdd()" icon="pi pi-plus-circle" label="Añadir" [style]="{
          'background-color': 'yellow',
          'margin-left': '500px',
          'border-color': 'yellow',
          'color': 'black'
        }"></p-button>
        <p-button (onClick)="onDelete()" icon="pi pi-trash" label="Eliminar" [style]="{
          'background-color': 'white',
          'margin-left': '15px',
          'border-color': 'white',
          'color': 'black'
        }"></p-button>
        <p-button (onClick)="onDownload()" icon="pi pi-download" label="Descargar" [style]="{
          'background-color': 'white',
          'margin-left': '15px',
          'border-color': 'white',
          'color': 'black'
        }"></p-button>
      </div>
  `,
  styles: ``
})
export class AppOperationComponent {
  @Output() add = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() download = new EventEmitter<void>();

  onAdd() {
    this.add.emit(true);
  }

  onDelete() {
    this.delete.emit();
  }

  onSearch(value: string) {
    this.search.emit(value);
  }

  onDownload() {
    this.download.emit(); 
  }
}


