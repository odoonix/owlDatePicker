/*

@see https://getbootstrap.com/docs/5.0/components/buttons/
*/
import { Component } from "@odoo/owl";
import { template } from "../components";


@template('component.button')
export class Button extends Component {
    static props = ['color', 'href'];

}