import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerta-cierre-sesion',
  templateUrl: './alerta-cierre-sesion.component.html',
  styleUrls: ['./alerta-cierre-sesion.component.css']
})
export class AlertaCierreSesionComponent implements OnInit {

  fnMensajeBase :()=>string;
  constructor() { }

  ngOnInit() {

  }

  fnMensaje():string{
    return this.fnMensajeBase?this.fnMensajeBase():'';
  }

}
