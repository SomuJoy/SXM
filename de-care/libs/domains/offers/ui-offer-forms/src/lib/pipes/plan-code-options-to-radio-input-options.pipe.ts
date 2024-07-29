import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'planCodeOptionsToRadioInputOptions' })
export class PlanCodeOptionsToRadioInputOptionsPipe implements PipeTransform {
    transform(
        value: {
            planCode: string;
            optionLabel?: string;
            optionLabelTooltipText?: string;
        }[]
    ): {
        label: string;
        value: string | number | unknown;
        tooltipText: string[];
    }[] {
        return Array.isArray(value)
            ? value.map(item => ({
                  value: item.planCode,
                  label: item.optionLabel,
                  tooltipText: [item.optionLabelTooltipText]
              }))
            : null;
    }
}
