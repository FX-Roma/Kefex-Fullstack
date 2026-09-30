import { Component } from '@angular/core';
import { Navbar } from '../../componentes/navbar/navbar';
import { Boton } from '../../componentes/boton/boton';

@Component({
  imports: [Boton],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
