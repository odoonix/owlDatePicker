import {
	Component,
	xml,
} from "@odoo/owl";




export class OCard extends Component {

	static template = xml`
	<canvas t-ref="chartCanvas" />
	`;
}
