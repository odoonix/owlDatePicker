
import { Component, xml, useState } from "@odoo/owl";

export default class DatePicker extends Component {
 
  state = useState({ date: '' });
  _updateInputValue(event) {
    this.state.date = event.target.value;
    console.log("state: ", this.state.date)
  }

  static template = xml`
  <div class="container">
  <div class="title">
  Date Picker
  </div>
  <div>
  <p>
  Select a date:
  </p>
    <input type="date" class="date"
    t-on-change="_updateInputValue"
     id="start" name="trip-start" 
     value="" 
     min="" 
     max="" />
     <div>
     <p> 
  Your selected date is: <t t-esc="state.date"/>
  </p>
  </div>
  </div>
  
  </div>
 
    `;
   

}