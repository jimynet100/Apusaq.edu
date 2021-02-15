import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';


@Component({
  selector: 'app-external-contenedor',
  template: `
    Link Externo
  `,
})
export class ExternalContenedorComponent  implements OnInit {
  constructor(private router: Router, private auth: AuthenticationService) {}

  ngOnInit() { 
    let cred = this.auth.credential;
    let url = this.router.url;
    if (url.indexOf('/ext/https/')>-1){
      url = url.replace('/ext/https/','');
      this.openUrl(`https://${url}/${cred.userName}/${cred.password}`);
    }
    else if (url.indexOf('/ext/http/')>-1){
      url = url.replace('/ext/http/','');
      this.openUrl(`http://${url}/${cred.userName}/${cred.password}`);
    }    
  } 

  openUrl(url){
      var win = window.open(url, '_blank');
      win.focus();
  }

}


