import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SesionService } from '../services/sesion.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-app-bar',
  standalone: true,
  imports: [MenubarModule, ButtonModule, MenuModule, HttpClientModule],
  providers: [SesionService],
  template: `
    <p-menubar [style]="{
        'position': 'fixed',
        'z-index' : '1041',
        'top': '-2px',
        'left': '-1px',
        'right': '-1px',
        'border-radius': '0px',
        'background-color': 'black',
    }">
      <ng-template pTemplate="start">
        <img src="logoHotelGordonita.png" height="40" class="mr-2" />
      </ng-template>
      <ng-template pTemplate="end">
        <label>{{username}}</label>
        <p-menu #menu [model]="items" [popup]="true" [style]="{'margin-top':'300px'}"/>
        <p-button icon="pi pi-bars" [rounded]="true" (click)="menu.toggle($event)" [text]="true" [style]="{ 'color': 'white' }" />
      </ng-template>
    </p-menubar>
  `,
  styles: `
    label {
      font-size: 14px;  
      color: white;
      margin-right: 20px;
      line-height: 45px; 
    }
    :host ::ng-deep .p-menu{
      top: 62px !important;
      z-index: 1200 !important;
    }
  `
})
export class AppBarComponent {
  username?: string;
  items: any[];

  constructor(private router: Router, private sesion: SesionService) {
    this.items = [
      { label: 'Perfil' },
      { label: 'Registrar Usuario' },
      { label: 'Establecer Base' },
      { label: 'Cerrar Sesión', command: () => this.logOut() }
    ];
  }

  ngOnInit() {
    this.username = this.sesion.getName();
  }

  logOut() {
    this.sesion.logOut().subscribe({
      next: (response) => {
        this.router.navigate(['/sesion']);
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  setUserName(name: string) {
    this.username = name;
  }
}
