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
  id = -1;
  receivedId: number | undefined;
  n = 10;
  myInterval: any;

  // Operations
  count = 0;
  sources: number[] = [];
  operationValues: number[] = [];

  constructor(private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        console.log(params['id']);
        this.id = params['id'];
      }
    });

    setInterval(() => {
      this.sendToHost();
    }, 5000);
  }

  sendToHost() {
    let randomIds = () => {
      let uniqueNumbers:Set<number> = new Set();
      while (uniqueNumbers.size < 5) {
        uniqueNumbers.add(Math.floor(Math.random() * this.n));
      }
      return Array.from(uniqueNumbers);
    }

    for (let targetId of randomIds()) {
      window.parent.postMessage({
        type: 'sendMessage',
        detail: {
          name: `data-mf-${this.id}`,
          sourceId: this.id,
          targetId: targetId,
          ts: Date.now(),
          random: Math.random()
        }
      }, 'http://localhost:4200/');
    }
  }

  @HostListener('window:message', ['$event'])
  handleSendToChild(event: MessageEvent) {
    if (event.data?.type === 'sendToChild') {
      const detail = event.data.detail;
      this.receivedId = detail.sourceId;
      this.count++;
      this.sources.push(detail.sourceId);
      this.operationValues.push(detail.sourceId + detail.targetId / detail.random)
    }
  }

}
