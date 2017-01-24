import { Component, DOM, createElement } from "react";
import * as classNames from "classnames";

import { Alert } from "./Alert";

interface ProgressBarProps {
    barType?: BarType;
    bootstrapStyle?: BootstrapStyle;
    colorSwitch?: number;
    contextObjectGuid?: string;
    maximumValue: number;
    onClickMicroflow?: string;
    progress: number | null;
}

type BootstrapStyle = "default" | "info" | "primary" | "success" | "warning" | "danger";
type BarType = "default" | "striped" | "animated";

class ProgressBar extends Component<ProgressBarProps, { alertMessage: string }> {
    static defaultProps: ProgressBarProps = {
        barType: "default",
        bootstrapStyle: "default",
        colorSwitch: 50,
        maximumValue: 100,
        progress: 0
    };

    constructor(props: ProgressBarProps) {
        super(props);

        this.state = { alertMessage: "" };
    }

    render() {
        const { barType, bootstrapStyle, colorSwitch, maximumValue, onClickMicroflow, progress } = this.props;
        const percentage = this.progressValue(progress, maximumValue);
        return DOM.div({ className: "widget-progressbar" },
            DOM.div(
                {
                    className: classNames("progress", {
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
            ),
            this.state.alertMessage ? createElement(Alert, { message: this.state.alertMessage }) : null
        );
    }

    private progressValue(progress: number | null, maximumValue: number) {
        if (typeof progress !== "number") {
            return 0;
        } else if (maximumValue < 1) {
            window.console.warn("The maximum value is less than one. Progress is set to Invalid");
            return 0;
        } else if (progress > maximumValue || Math.abs(this.calculatePercentage(progress, maximumValue)) > 100) {
            return 100;
        }

        return this.calculatePercentage(progress, maximumValue);
    }

    private calculatePercentage(progress: number, maxValue: number) {
        return Math.round((progress / maxValue) * 100);
    }

    private executeMicroflow (action: string | undefined, guid: string | undefined) {
        if (action && guid) {
            window.mx.ui.action(action, {
                error: (error: Error) => {
                    this.setState({ alertMessage: `Error while executing microflow: ${action}: ${error.message}` });
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
