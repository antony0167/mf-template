import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MfPost } from './mf-post/mf-post';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MfPost],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {

}
