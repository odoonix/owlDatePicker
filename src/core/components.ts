import { Component, onError, useSubEnv, xml } from "@odoo/owl";



/**
 * A decorator to add template into a component
 */
export const template = (name: string) => {
    return (component: any) => {
        component.template = name;
    }
}

export const defaultProps = (values: any) => {
    return (component: any) => {
        component.defaultProps = values;
    }
}

export const props = (values: any) => {
    return (component: any) => {
        component.props = values;
    }
}

export const components = (values: any) => {
    return (component: any) => {
        component.components = values;
    }
}



@props(["onError"])
@template(xml`<t t-slot="default" />`)
export class ErrorHandler extends Component {
    setup() {
        onError((error) => {
            this.props.onError(error);
        });
    }
}

@template(xml`<t t-slot="default"/>`)
export class WithEnv extends Component {
    setup() {
        useSubEnv(this.props.env);
    }
}
