import { Component, Input, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() dataCollapsedSidebar!: boolean;
  userInfo: any;

  constructor(
    private sidebarService: SidebarService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    console.log('this.userInfo', this.userInfo);
  }

  ngOnInit(): void {
    this.sidebarService.isSidebarCollapsed$.subscribe(isCollapsed => {
      this.dataCollapsedSidebar = isCollapsed;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
