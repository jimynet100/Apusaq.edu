import { Component, OnInit } from '@angular/core';
//services
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html'
})
export class NotificacionComponent implements OnInit {

  constructor(private notificacionService: NotificacionService) {}

  ngOnInit() {
    /*
    this.notificacionService.success('Alerta!!!!', ' success');
    this.notificacionService.error('Alerta!!!!', 'error');
    this.notificacionService.info('Alerta!!!!', 'info');
    this.notificacionService.warning('Alerta!!!!', 'warning');*/
  }



}
