import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NotificacionService } from 'src/app/shared/services/util/notificacion.service';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form:FormGroup;
  
  //@ViewChild(CaptchaComponent ,{static: true}) captcha: CaptchaComponent;

  constructor(private authenticationService: AuthenticationService, private notificacionService: NotificacionService) { 
    this.form = new FormGroup ({
      userName: new FormControl('',[Validators.required,Validators.maxLength(20)]),
      password: new FormControl('',[Validators.required,Validators.maxLength(20)])
      //captchaCode: new FormControl('',[Validators.required,Validators.maxLength(4)])
    });
  }

  ngOnInit() {
  }

  login(){
    const self = this; 
    let value = self.form.value;
    if (!value || !value.userName || !value.password){
      this.notificacionService.error('Error','Complete los datos');
      return;
    }

    self.authenticationService.login(self.form.value).subscribe({
      next: (result: any) => {
        self.authenticationService.loginExito(result, self.form.value);
      }, 
      error: (error: any) => {
        self.form.controls['password'].reset();
        //self.captcha.refresh();
      }, 
      complete: () => {}
    });
  }

  error(body: string, title: string="Error"){
    this.notificacionService.error(title,body);
  } 

  isValid(){
    if (!environment.production){
      return true;
    }
    return this.form.valid;
  }

  loginPorPerfil(usuario){
    let self = this;
    self.authenticationService.login({userName:usuario, password:usuario}).subscribe(resultado=>{
      self.authenticationService.loginExito(resultado, {userName:usuario, password:usuario});
    });
  }

}
