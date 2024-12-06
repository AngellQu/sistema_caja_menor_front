import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { SesionService } from '../services/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-sesion',
  standalone: true,
  imports: [ReactiveFormsModule,
    ToastModule,
    PasswordModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule],
  templateUrl: './app-sesion.component.html',
  styleUrl: './app-sesion.component.css',
  providers: [SesionService, MessageService]
})
export class AppSesionComponent {
  cedula = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
  contrasenia = new FormControl('', Validators.required);

  constructor(private router: Router, private sesionService: SesionService, private messageService: MessageService) { }

  logIn() {
    if (this.cedula.valid && this.contrasenia.valid) {
      const username = this.cedula.value!;
      const password = this.contrasenia.value!;

      this.sesionService.logIn(username, password).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        },
      });
    }
  }
}

