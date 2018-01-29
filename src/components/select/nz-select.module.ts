import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { NzLocaleModule } from '../locale/index';
import { NzSelectComponent } from './nz-select.component';
import { NzOptionComponent } from './nz-option.component';
import { SM_select_enum_Component } from './SM_select_enum.component';
import { NzOptionPipe } from './nz-option.pipe';

@NgModule({
  imports     : [ CommonModule, FormsModule, OverlayModule, NzLocaleModule ],
  declarations: [ NzOptionPipe, NzOptionComponent, NzSelectComponent, SM_select_enum_Component ],
  exports     : [ NzOptionPipe, NzOptionComponent, NzSelectComponent, SM_select_enum_Component ]
})

export class NzSelectModule {
}


