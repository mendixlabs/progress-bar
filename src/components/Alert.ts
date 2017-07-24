import { StatelessComponent, createElement } from "react";

export const Alert: StatelessComponent<{ message?: string }> = (props) =>
    props.message
        ? createElement("div", { className: "alert alert-danger widget-progressbar-alert" }, props.message)
        : null as any;

Alert.displayName = "Alert";
