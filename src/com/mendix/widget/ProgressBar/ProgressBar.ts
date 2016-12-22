import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { MicroFlowProps, ProgressBar as ProgressBarComponent, ProgressBarProps } from "./components/ProgressBar";

class ProgressBar extends WidgetBase {
    // Parameters configured from modeler
    progressAttribute: string;
    bootstrapStyleAttribute: string;
    classBar: string;
    barType: string;
    textColorSwitch: number;
    maximumValueAttribute: string;
    onclickMicroflow: string;
    // Internal variables
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.updateRendering();
    }

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
        const percentage = this.contextObject
            ? Math.round(parseInt(this.contextObject.get(this.progressAttribute)as string, 10))
            : 0;
        const bootstrapStyle = this.contextObject && this.bootstrapStyleAttribute
            ? (this.contextObject.get(this.bootstrapStyleAttribute))as string
            : this.classBar !== "none" ? this.classBar : "";
        const maximumValue = this.contextObject && this.maximumValueAttribute
            ? Number(this.contextObject.get(this.maximumValueAttribute))
            : undefined;

        return {
            barType: this.barType,
            bootstrapStyle,
            colorSwitch: this.textColorSwitch,
            maximumValue,
            microflowProps: this.createOnClickProps(),
            percentage
        };
    }

    private createOnClickProps(): MicroFlowProps {
        return ({
            guid: this.contextObject ? this.contextObject.getGuid() : undefined,
            name: this.onclickMicroflow
        });
    }

    private resetSubscriptions() {
        this.unsubscribeAll();
        if (this.contextObject) {
            this.subscribe({
                callback: (guid) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.progressAttribute,
                callback: (guid, attr, attrValue) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.bootstrapStyleAttribute,
                callback: (guid, attr, attrValue) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.maximumValueAttribute,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.ProgressBar.ProgressBar", [ WidgetBase ],
    (function (Source: any) {
        let result: any = {};
        for (let i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    }(ProgressBar))
);
