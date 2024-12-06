import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
        <p class="date">{{ currentDate | date: 'd/M/yyyy'}}</p>
        <p class="time">{{ currentTime | date: 'shortTime'}}</p>
        <p class="total">Total:{{ saldo }}</p>
  `,
  styles: `
     .date{
      margin-left: 18px;
      font-size: 50px;
      color: black;
      position: relative;
      top: 220px;
    }
    .time{
      margin-left: 25px;
      font-size: 30px;
      color: black;
      position: relative;
      top: 180px;
    }
    .total{
      font-size: 80px;
      margin-left: 700px;
      color: black;
      position: relative;
      top:20px;
    }
  `
})
export class AppInicioComponent {
  currentTime?: Date;
  currentDate?: Date;
  saldo?: string;
  private readonly SALDO_KEY = "saldo";
  timeIntervalId: any;
  dateIntervalId: any;

  constructor() {
    this.currentTime = new Date();
    this.currentDate = new Date();
  }

  setSaldo(saldo: string) {
    const saldoFormateado = Number(saldo).toLocaleString('es-CO', {
      maximumFractionDigits: 0,
    });
    localStorage.setItem(this.SALDO_KEY, saldoFormateado);
  }

  ngOnInit() {
    this.saldo = localStorage.getItem(this.SALDO_KEY) ?? '';
    this.timeIntervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.dateIntervalId = setInterval(() => {
      this.currentDate = new Date();
    }, 3600000);

    this.currentTime = new Date();
    this.currentDate = new Date();
  }

  ngOnDestroy() {
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
    if (this.dateIntervalId) {
      clearInterval(this.dateIntervalId);
    }
  }
}
