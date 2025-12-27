import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Startscreen } from "./startscreen/startscreen";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Startscreen, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('daBubble');
  showSplash = true;
}
