import { Component } from '@angular/core';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private sidebarService: SidebarService) { }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout(){
    console.log("log out");
  }
}
