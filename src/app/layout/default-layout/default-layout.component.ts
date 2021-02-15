import { Component, Input } from '@angular/core';
import { versions } from 'src/environments/versions';
import { AuthenticationService } from 'src/app/shared/services/security/authentication.service';
import { ConfigService } from 'src/app/shared/services/configurador/config.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {

  public navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(private authenticationService: AuthenticationService, private configService: ConfigService) {

    this.navItems = this.authenticationService.getMenu();
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

  }

  logout(){
    this.authenticationService.logout();
  }
  refresh(){
    this.configService.reloadConfig();
  }

  getVersion(){
    return `${versions.version} [${versions.revision}_${versions.fecha}]`;
  }

  getNombreUser(){
    return this.authenticationService.getNombreUser();
  }

  getDniUser(){
    return this.authenticationService.getDniUser();
  }

  getUltimoLogin(){
    return this.authenticationService.getUltimoLogin();
  }

}
