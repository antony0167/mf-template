import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  counter = 0;

  sendToHost() {
    window.parent.postMessage({
      type: 'buttonClicked',
      detail: {
        name: 'buttonClicked',
        count: this.counter++
      }
    }, '*');
  }
}
