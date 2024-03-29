import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
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

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '', 
        redirectTo: 'parking-lots', 
        pathMatch: 'full' 
      },
      {
        path: 'parking-lots',
        component: ParkingLotsComponent
      },
      {
        path: 'providers',
        component: ProvidersComponent
      },
      {
        path: 'consumers',
        component: ConsumersComponent
      },
      {
        path: 'bookings',
        component: BookingsComponent
      },
      {
        path: 'spaces',
        component: SpacesComponent
      },
      {
        path: 'space/:id',
        component: SpaceDetailComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'notifications',
        component: NotificationsComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
