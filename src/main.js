// ES2015 Javascript
import { Component, xml, useState, mount } from "@odoo/owl";
import DatePicker from './datePicker'


class Root extends Component {
  static template = xml`
    <div class="main">
    <DatePicker/>
    </div>
    `;

  static components = { DatePicker };
}

mount(Root, document.body);