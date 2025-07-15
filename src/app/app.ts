import {Component, OnInit} from '@angular/core';
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
        id: this.id
      }
    }, 'http://localhost:4200/');
  }

}
