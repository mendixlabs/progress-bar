import { Component, createElement } from "react";
import { ProgressBar, ProgressBarProps } from "./components/ProgressBar";
import ProgressBarContainer, { ProgressBarContainerProps } from "./components/ProgressBarContainer";
import { Alert } from "./components/Alert";

declare function require(name: string): string;

// tslint:disable-next-line:class-name
export class preview extends Component<ProgressBarContainerProps, {}> {

    render() {
        const warnings = ProgressBarContainer.validateProps(this.props);
        if (warnings) {
            return createElement(Alert, { message: warnings });
        }
        return createElement(ProgressBar, this.transformProps(this.props));
    }

    private transformProps(props: ProgressBarContainerProps): ProgressBarProps {
        return {
            barType: props.barType,
            bootstrapStyle: props.bootstrapStyle,
            className: props.class,
            maximumValue: 100,
            progress: 80,
            style: ProgressBarContainer.parseStyle(props.style)
        };
    }
}

export function getPreviewCss() {
    return require("./ui/ProgressBar.scss");
}
