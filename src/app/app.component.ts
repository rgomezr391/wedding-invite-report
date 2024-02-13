import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:  [ MainService ]
})
export class AppComponent {
  
  title = 'wedding-invite-report-app';
  guests: any[] = [];
  constructor(private mainService: MainService) {
    this.fetchGuests();
  }

  async fetchGuests() {
    this.guests = await this.mainService.getGuests();
    
  }
}
