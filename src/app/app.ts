import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private route: ActivatedRoute) {}

  id = -1;
  value: number | undefined;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        console.log(params['id']);
        this.id = params['id'];
      }
    });
  }

  sendToHost() {
    window.parent.postMessage({
      type: 'buttonClicked',
      detail: {
        name: 'buttonClicked',
        sourceId: this.id,
        targetId: Math.round(Math.random() * 10)
      }
    }, 'http://localhost:4200/');
  }

  @HostListener('window:message', ['$event'])
  handleSendToChild(event: MessageEvent) {
    if (event.data?.type === 'sendToChild') {
      const detail = event.data.detail;
      this.value = detail.sourceId / detail.targetId;
    }
  }

}
