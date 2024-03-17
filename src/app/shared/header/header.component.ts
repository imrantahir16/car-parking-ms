import { Component } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private sidebarService: SidebarService,
    private _router: Router) { }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._router.navigateByUrl('');
  }
}
