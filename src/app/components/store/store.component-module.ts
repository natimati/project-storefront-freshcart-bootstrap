import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreComponent } from './store.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [StoreComponent],
  providers: [],
  exports: [StoreComponent]
})
export class StoreComponentModule {
}
