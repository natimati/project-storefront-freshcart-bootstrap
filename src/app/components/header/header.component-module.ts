import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [CommonModule, RouterModule, CollapseModule.forRoot()],
  declarations: [HeaderComponent],
  providers: [],
  exports: [HeaderComponent]
})
export class HeaderComponentModule {
}
