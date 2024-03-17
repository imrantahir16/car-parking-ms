import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FilterTablePipe } from './pipe/filter.pipe';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FilterTablePipe
  ],
  imports: [CommonModule, SharedRoutingModule, FormsModule],
  exports: [
    SidebarComponent,
    HeaderComponent,
    FilterTablePipe
  ],
})
export class SharedModule {}
