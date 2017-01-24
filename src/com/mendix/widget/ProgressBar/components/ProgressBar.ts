import { Component, DOM } from "react";

import * as classNames from "classnames";

interface ProgressBarProps {
    barType?: BarType;
    bootstrapStyle?: BootstrapStyle;
    colorSwitch: number;
    contextObjectGuid?: string;
    maximumValue?: number;
    onClickMicroflow?: string;
    progress: number;
}

type BootstrapStyle = "default" | "info" | "primary" | "success" | "warning" | "danger";
type BarType = "default" | "striped" | "animated";

class ProgressBar extends Component<ProgressBarProps, {}> {
    static defaultProps: ProgressBarProps = {
        barType: "default",
        bootstrapStyle: "default",
        colorSwitch: 50,
        progress: 0
    };

    render() {
        const { barType, bootstrapStyle, colorSwitch, maximumValue, onClickMicroflow, progress } = this.props;
        const percentage = this.progressValue(progress, maximumValue);
        return DOM.div(
            {
                className: classNames("progress", "widget-progressbar", {
                    "red-progressbar-text": maximumValue < 1,
                    "widget-progressbar-clickable": !!onClickMicroflow,
                    "widget-progressbar-text-contrast": percentage < colorSwitch
                }),
                onClick: () => this.executeMicroflow(onClickMicroflow, this.props.contextObjectGuid)
            },
            DOM.div(
                {
                    className: classNames("progress-bar", `progress-bar-${bootstrapStyle}`, {
                        "active": barType === "animated",
                        "progress-bar-striped": barType === "striped" || barType === "animated",
                        "widget-progressbar-negative": percentage < 0
                    }),
                    style: { width: `${Math.abs(percentage)}%` }
                },
                progress
                    ? maximumValue < 1 ? "Invalid" : `${this.calculatePercentage(progress, maximumValue)}%`
                    : ""
            )
        );
    }

    private progressValue(progress: number, maximumValue: number) {
        const maxValue = typeof maximumValue === "undefined" ? 100 : maximumValue;

        if (typeof progress !== "number") {
            return 0;
        } else if (maxValue < 1) {
            window.logger.warn("The maximum value is less than one. Progress is set to Invalid");
            return 0;
        } else if (progress > maxValue || Math.abs(this.calculatePercentage(progress, maxValue)) > 100) {
            return 100;
        }

        return this.calculatePercentage(progress, maxValue);
    }

    private calculatePercentage(progress: number, maxValue: number) {
        return Math.round((progress / maxValue) * 100);
    }

    private executeMicroflow (action: string, guid: string) {
        if (action && guid) {
            window.mx.ui.action(action, {
                error: (error: Error) => {
                    window.mx.ui.error(`Error while executing microflow: ${action}: ${error.message}`);
                },
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                }
            });
        }
    }
}

export { BarType, BootstrapStyle, ProgressBar, ProgressBarProps };
