import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './domsanitizer.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DomSanitizerPipe
  ],
  exports:[
    DomSanitizerPipe
  ],
  entryComponents: [
   
  ]
  
})
export class PipeModule { }
