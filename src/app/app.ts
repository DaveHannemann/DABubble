import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Startscreen } from "./startscreen/startscreen";
import { CommonModule } from '@angular/common';
import { BrandStateService } from './services/brand-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Startscreen, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(public brandState: BrandStateService) {}
  protected readonly title = signal('daBubble');
}
