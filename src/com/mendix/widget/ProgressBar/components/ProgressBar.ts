import { Component, DOM, createElement } from "react";
import * as classNames from "classnames";

import { Alert } from "./Alert";
import "../ui/ProgressBar.css";

interface ProgressBarProps {
    barType?: BarType;
    bootstrapStyle?: BootstrapStyle;
    colorSwitch?: number;
    contextObject?: mendix.lib.MxObject;
    maximumValue: number;
    onClickMicroflow?: string;
    onClickOption?: OnClickOptions;
    onClickPage?: string;
    pageLocation?: PageLocation;
    progress: number | null;
}

type BootstrapStyle = "default" | "info" | "primary" | "success" | "warning" | "danger";
type BarType = "default" | "striped" | "animated";
export type OnClickOptions = "doNothing" | "showPage" | "callMicroflow";
export type PageLocation = "content" | "popup" | "modal";

class ProgressBar extends Component<ProgressBarProps, { alertMessage: string }> {
    static defaultProps: ProgressBarProps = {
        barType: "default",
        bootstrapStyle: "default",
        colorSwitch: 50,
        maximumValue: 100,
        onClickOption: "doNothing",
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
                        "widget-progressbar-alert": maximumValue < 1,
                        "widget-progressbar-clickable": !!onClickMicroflow,
                        "widget-progressbar-text-contrast": percentage < colorSwitch
                    }),
                    onClick: () => this.handleClick()
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
                    this.getProgressText(progress, maximumValue)
                )
            ),
            this.state.alertMessage ? createElement(Alert, { message: this.state.alertMessage }) : null
        );
    }

    private progressValue(progress: number | null, maximumValue: number) {
        if (typeof progress !== "number" || maximumValue < 1) {
            return 0;
        } else if (progress > maximumValue || Math.abs(this.calculatePercentage(progress, maximumValue)) > 100) {
            return 100;
        }

        return this.calculatePercentage(progress, maximumValue);
    }

    private calculatePercentage(progress: number, maxValue: number) {
        return Math.round((progress / maxValue) * 100);
    }

    private getProgressText(progress: number | null, maximumValue: number): string {
        if (progress) {
            return maximumValue < 1
                ? "Invalid"
                : `${this.calculatePercentage(progress, maximumValue)}%`;
        }

        return "";
    }

    private handleClick () {
        const { contextObject, onClickMicroflow, onClickOption, onClickPage, pageLocation } = this.props;
        if (contextObject && onClickOption === "callMicroflow" && onClickMicroflow && contextObject.getGuid()) {
            window.mx.ui.action(onClickMicroflow, {
                error: (error) =>
                    this.setState({
                        alertMessage: `Error while executing microflow ${onClickMicroflow}: ${error.message}`
                    }),
                params: {
                    applyto: "selection",
                    guids: [ contextObject.getGuid() ]
                }
            });
        } else if (contextObject && onClickOption === "showPage" && onClickPage && contextObject.getGuid()) {
            const context = new window.mendix.lib.MxContext();
            context.setTrackId(contextObject.getGuid());
            context.setTrackEntity(contextObject.getEntity());

            window.mx.ui.openForm(onClickPage, {
                error: (error) =>
                    this.setState({ alertMessage: `Error while opening page ${onClickPage}: ${error.message}` }),
                context,
                location: pageLocation
            });
        }
    }
}

export { BarType, BootstrapStyle, ProgressBar, ProgressBarProps };
