import { Router, ActivatedRoute } from '@angular/router';
import { Component, ElementRef, ViewChild, Inject, HostListener} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-internal-contenedor',
  templateUrl: './internal-contenedor.component.html',
  host: {
    '(window:resize)': 'onResize($event)'
  } 
})
export class InternalContenedorComponent {
  url: string = "";
  divContainer:HTMLElement;
  divFooter:HTMLElement;
  height:number=500;
  constructor(@Inject(DOCUMENT) document, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe( params => console.log(params));
    this.divFooter = document.getElementById('divFooter') as HTMLElement;
  } 

  ngOnInit() {
    this.height = this.getMaxHeight();
    let url = this.router.url;
    url = url.replace('/int/https/',`https:////`);
    url = url.replace('/int/https/',`http:////`);
    this.url = url;
  } 

  private getMaxHeight():number{
    return this.divFooter && this.divFooter.getBoundingClientRect() ? this.divFooter.getBoundingClientRect().top - 120: 500;
  }

  onResize(event) {
    //event.target.innerWidth;
    this.height = this.getMaxHeight();
  }

}

