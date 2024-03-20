import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ParkingLotsComponent } from './parking-lots/parking-lots.component';
import { ProvidersComponent } from './providers/providers.component';
import { ConsumersComponent } from './consumers/consumers.component';
import { BookingsComponent } from './bookings/bookings.component';
import { SpacesComponent } from './spaces/spaces.component';
import { PaymentComponent } from './payment/payment.component';
import { SpaceDetailComponent } from './space-detail/space-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    HomeComponent,
    ParkingLotsComponent,
    ProvidersComponent,
    ConsumersComponent,
    BookingsComponent,
    SpacesComponent,
    PaymentComponent,
    SpaceDetailComponent,
    ProfileComponent,
    NotificationsComponent,
    TransactionsComponent
  ],
  imports: [CommonModule, DashboardRoutingModule, SharedModule, FormsModule],
})
export class DashboardModule {}
