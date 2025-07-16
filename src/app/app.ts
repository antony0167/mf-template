import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
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
        this.id = params['id'];
      }
    });

    this.startCommunication();
  }

  startCommunication() {
    this.myInterval = setInterval(() => {
      this.sendMessage();
    }, 5000);
  }

  sendMessage() {
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
  handleMessage(event: MessageEvent) {

    if (event.origin !== 'http://localhost:4200') return;


    if (event.data?.type === 'sendMessage' && event.data.detail) {
      const detail = event.data.detail;
      this.receivedId = detail.sourceId;
      this.count++;
      this.sources.push(detail.sourceId);
      this.operationValues.push(detail.sourceId + detail.targetId / detail.random)
    }
  }

  ngOnDestroy() {
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
  }

}
