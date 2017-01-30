import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import {
    BarType,
    BootstrapStyle,
    OnClickOptions,
    PageLocation,
    ProgressBar as ProgressBarComponent,
    ProgressBarProps
} from "./components/ProgressBar";

class ProgressBar extends WidgetBase {
    // Parameters configured from modeler
    progressAttribute: string;
    bootstrapStyleAttribute: string;
    progressStyle: BootstrapStyle;
    barType: BarType;
    textColorSwitch: number;
    maximumValueAttribute: string;
    onClickMicroflow: string;
    onClickOption: OnClickOptions;
    onClickPage: string;
    pageLocation: PageLocation;
    // Internal variables
    private contextObject: mendix.lib.MxObject;

    update(object: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();

        if (callback) {
            callback();
        }
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering() {
        render(createElement(ProgressBarComponent, this.getProgressBarProps()), this.domNode);
    }

    private getProgressBarProps(): ProgressBarProps {
        const { bootstrapStyleAttribute, contextObject, maximumValueAttribute, progressAttribute } = this;
        let progress = 0;
        let bootstrapStyle = this.progressStyle;
        let maximumValue = 100;
        if (this.contextObject) {
            progress = Math.round(parseInt(contextObject.get(progressAttribute) as string, 10));
            bootstrapStyle = contextObject.get(bootstrapStyleAttribute || "") as BootstrapStyle || bootstrapStyle;
            maximumValue = maximumValueAttribute ? contextObject.get(maximumValueAttribute) as number : maximumValue;
        }

        return {
            barType: this.barType,
            bootstrapStyle,
            colorSwitch: this.textColorSwitch,
            contextObject: this.contextObject,
            maximumValue,
            onClickMicroflow: this.onClickMicroflow,
            onClickOption: this.onClickOption,
            onClickPage: this.onClickPage,
            pageLocation: this.pageLocation,
            progress
        };
    }

    private resetSubscriptions() {
        this.unsubscribeAll();
        if (this.contextObject) {
            this.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });

            [ this.progressAttribute, this.bootstrapStyleAttribute, this.maximumValueAttribute ].forEach((attribute) =>
                this.subscribe({
                    attr: attribute,
                    callback: () => this.updateRendering(),
                    guid: this.contextObject.getGuid()
                })
            );
        }
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.ProgressBar.ProgressBar", [ WidgetBase ], function(Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(ProgressBar));
