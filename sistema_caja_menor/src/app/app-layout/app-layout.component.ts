import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarComponent } from '../app-bar/app-bar.component';
import { AppTabComponent } from '../app-tab/app-tab.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, AppBarComponent, AppTabComponent, RouterModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {

}
