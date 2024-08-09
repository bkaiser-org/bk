import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-trip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.css',
})
export class TripComponent {}
