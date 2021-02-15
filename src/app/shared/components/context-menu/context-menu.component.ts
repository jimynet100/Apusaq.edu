import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ContextMenuService } from 'ngx-contextmenu';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  ngOnInit() {
  }

    public items = [
        { name: 'John', otherProperty: 'Foo', type: 'type1' },
        { name: 'Joe', otherProperty: 'Bar', type: 'type2' }
    ];
    @ViewChild(ContextMenuComponent,{static: true}) public contextMenu: ContextMenuComponent;
    public contextMenuActions = [
      {
        html: (item) => `Say hi!`,
        click: (item) => alert('Hi, ' + item.name),
        enabled: (item) => true,
        visible: (item) => item.type === 'type1',
      },
      {
        divider: true,
        visible: true,
      },
      {
        html: (item) => `Something else`,
        click: (item) => alert('Or not...'),
        enabled: (item) => false,
        visible: (item) => item.type === 'type1',
      },
    ];


    showMessage(str,str2?){
      //console.log(str);
    }
}
