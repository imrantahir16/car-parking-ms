import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [CommonModule, SharedRoutingModule, FormsModule],
  exports: [
    SidebarComponent,
    HeaderComponent
  ],
})
export class SharedModule {}
