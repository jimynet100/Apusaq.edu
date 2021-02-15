import { Component, OnInit, Input} from '@angular/core';

export interface ErrorPageConfig{
  url: string;
  error: string;
  internalError: string;
}

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.sass']
})
export class ErrorPageComponent implements OnInit {

  @Input()
  config: ErrorPageConfig;

  constructor() {

  }

  ngOnInit() {
  }

}

