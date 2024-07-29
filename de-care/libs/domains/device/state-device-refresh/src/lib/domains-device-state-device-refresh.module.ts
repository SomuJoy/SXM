import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendRefreshSignalWorkflowService } from '../lib/workflows/send-refresh-signal-workflow.service';
import { SendTextInstructionsWorkflowService } from '../lib/workflows/send-text-instructions-workflow.service';
import { DataDevicesService } from '../lib/data-services/data-devices.service';

@NgModule({
    imports: [CommonModule],
    providers: [SendRefreshSignalWorkflowService, SendTextInstructionsWorkflowService, DataDevicesService]
})
export class DomainsDeviceStateDeviceRefreshModule {}
