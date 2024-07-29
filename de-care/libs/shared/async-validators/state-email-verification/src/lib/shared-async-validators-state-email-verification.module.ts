import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedStateSettingsModule]
})
export class SharedAsyncValidatorsStateEmailVerificationModule {}
