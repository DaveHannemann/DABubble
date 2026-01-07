import { Component } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class ReactionTooltipComponent {
  emoji!: string;
  names!: string[];
}
