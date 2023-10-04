/** @odoo-module **/
import { Component, onWillDestroy, useChildSubEnv, useState } from "@odoo/owl";

import { defaultProps, props, template } from "../components";
import { useHotkey } from "../hotkeys/hotkey_hook";
import { useActiveElement } from "../ui/ui_service";
import { useForwardRefToParent } from "../utils/hooks";

import "./dialog.scss";
import "./dialog.xml";

@template("web.Dialog")
@defaultProps({
    contentClass: "",
    bodyClass: "",
    fullscreen: false,
    footer: true,
    header: true,
    size: "lg",
    technical: true,
    title: "Odoo",
    withBodyPadding: true,
})
@props({
    contentClass: { type: String, optional: true },
    bodyClass: { type: String, optional: true },
    fullscreen: { type: Boolean, optional: true },
    footer: { type: Boolean, optional: true },
    header: { type: Boolean, optional: true },
    size: { type: String, optional: true, validate: (s) => ["sm", "md", "lg", "xl"].includes(s) },
    technical: { type: Boolean, optional: true },
    title: { type: String, optional: true },
    modalRef: { type: Function, optional: true },
    slots: {
        type: Object,
        shape: {
            default: Object, // Content is not optional
            header: { type: Object, optional: true },
            footer: { type: Object, optional: true },
        },
    },
    withBodyPadding: { type: Boolean, optional: true },
})
export class Dialog extends Component {

    modalRef: any;
    data: any;
    id: any;

    setup() {
        this.modalRef = useForwardRefToParent("modalRef");
        useActiveElement("modalRef");
        this.data = useState(this.env.dialogData);
        useHotkey("escape", () => {
            this.data.close();
        });
        this.id = `dialog_${this.data.id}`;
        useChildSubEnv({ inDialog: true, dialogId: this.id, closeDialog: this.data.close });

        onWillDestroy(() => {
            if (this.env.isSmall) {
                this.data.scrollToOrigin();
            }
        });
    }

    get isFullscreen() {
        return this.props.fullscreen || this.env.isSmall;
    }
}