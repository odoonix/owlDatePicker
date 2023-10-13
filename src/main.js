// ES2015 Javascript
import { Component, xml, useState, mount } from "@odoo/owl";


class Counter extends Component {
  static template = xml`
    <button t-on-click="() => state.value = state.value + props.increment" data-custom="example" >
      Click Me! [<t t-esc="state.value"/>]
    </button>`;


  state = useState({ value: 0 });
}


class Root extends Component {
  static template = xml`
    <span>Hello Owl</span>
    <Counter increment="2"/>`;

  static components = { Counter };
}

mount(Root, document.body);