import { Component } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  userInfo: any;

  constructor(
    private sidebarService: SidebarService,
    private _router: Router) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._router.navigateByUrl('');
  }
}
