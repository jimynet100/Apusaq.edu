import { EventManager } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResizeService {

  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  private resizeSubject: Subject<Window>;

  constructor(private eventManager: EventManager) {
    this.resizeSubject = new Subject();
    this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
  }

  private onResize(event: UIEvent) {
    this.resizeSubject.next(<Window>event.target);
  }
}

/**
 * como usarlo
 export class MyComponent implements OnInit {

  private resizeSubscription: Subscription;

  constructor(private resizeService: ResizeService) { }

  ngOnInit() {
    this.resizeSubscription = this.resizeService.onResize$
      .subscribe(size => console.log(size));
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
 * 
 */