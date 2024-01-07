
import { Component, xml, useState } from "@odoo/owl";

export default class DatePicker extends Component {
 
  state = useState({ date: '' });
  _updateInputValue(event) {
    this.state.date = event.target.value;
    console.log("state: ", this.state.date)
  }

  static template = xml`
    <div class="datepicker" id="datepicker">
      <input type="text" class="datepicker-input" readonly="readonly" placeholder="Select a date" />
      <div class="calendar">
        <table>
          <caption></caption>
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
            <tr t-foreach="widget._calendar" t-as="week" t-key="weekIndex">
              <td t-foreach="week" t-as="date" t-key="dateIndex" t-att-class="{'selected': widget.date && widget.date.getTime() === date.getTime()}">
                <t t-if="date">
                  <t t-esc="date.getDate()" />
                </t>
                <t t-if="!date"></t>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `;
   

}