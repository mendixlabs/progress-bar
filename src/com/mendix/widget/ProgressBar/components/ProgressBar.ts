import { DOM } from "react";

import * as classNames from "classnames";

export interface MicroFlowProps {
    name: string;
    guid: string;
}

export interface ProgressBarProps {
    barType?: string;
    bootstrapStyle?: string;
    maximumValue?: number;
    microflowProps?: MicroFlowProps;
    colorSwitch: number;
    percentage: number;
}

export const ProgressBar = (props: ProgressBarProps) =>
    DOM.div(
        {
            className: widgetClasses(props.percentage, props.colorSwitch, props.microflowProps, props.maximumValue),
            onClick: () => executeMicroflow(props.microflowProps),
            style: { width: "100%" }
        },
        DOM.div(
            {
                className: progressClasses(props.bootstrapStyle, props.barType, props.percentage),
                style: { width: Math.abs(progressValue(props.percentage, props.maximumValue)) + "%" }
            },
            props.percentage
                ? props.maximumValue < 1 ? "Invalid" : roundValue(props.percentage, props.maximumValue) + "%"
                : ""
        )
    );

const widgetClasses = (percentage: number, colorSwitch: number, microflow: MicroFlowProps, maximumValue: number) =>
    classNames(
        "progress",
        "widget-progressbar", {
            "red-progressbar-text": maximumValue < 1,
            "widget-progressbar-text-contrast": progressValue(percentage, maximumValue) < colorSwitch,
            "widget-progressbar-clickable": microflow && microflow.name !== ""
        }
    );

const progressClasses = (bootstrapStyle: string, barType: string, percentage: number) =>
    classNames("progress-bar", {
        "progress-bar-info": bootstrapStyle === "info",
        "progress-bar-danger": bootstrapStyle === "danger",
        "progress-bar-warning": bootstrapStyle === "warning",
        "progress-bar-success": bootstrapStyle === "success",
        "progress-bar-striped": barType === "striped",
        "progress-bar-striped active": barType === "animated",
        "widget-progressbar-negative": percentage < 0
    });

const progressValue = (progressAttributeValue: number, maximumValue: number) => {
    const maxValue = typeof maximumValue === "undefined" ? 100 : maximumValue;

    if (!progressAttributeValue || typeof progressAttributeValue === "undefined") {
        return 0;
    } else if (maxValue < 1) {
        window.logger.warn("The maximum value is less than one. Progress is set to Invalid");
        return 0;
    } else if (progressAttributeValue > maxValue || Math.abs(roundValue(progressAttributeValue, maxValue)) > 100) {
        return 100;
    } else {
        return roundValue(progressAttributeValue, maxValue);
    }
};

const roundValue = (progress: number, maxValue: number) => {
    return Math.round((progress / maxValue) * 100);
};

const executeMicroflow = (props: MicroFlowProps) => {
    if (props && props.name && props.guid) {
        window.mx.ui.action(props.name, {
            error: (error: Error) => {
                window.mx.ui.error(`Error while executing microflow: ${props.name}: ${error.message}`);
            },
            params: {
                applyto: "selection",
                guids: [ props.guid ]
            }
        });
    }
};
