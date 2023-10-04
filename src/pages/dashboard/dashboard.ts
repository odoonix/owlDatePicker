import { Component, useState } from "@odoo/owl";
import { route, template, title } from "../../core/pages";
import { Button } from "../../core/buttons";
import { registry } from "../../core/registry";

import "./dashboard.xml";

@route('/')
@title('Dashboard')
@template('pages.dashboard')
export class Dashboard extends Component {
	static components = {Button};
	state: {
		pages: Component[]
	} = useState({
		pages: []
	});

	public setup(): void {
		// Load registerd pages
		this.state.pages = registry.category('pages').getAll();

		// Gets list of pages if any updates
		registry.category('pages').addEventListener('UPDATE', ()=>{
			this.state.pages = registry.category('pages').getAll();
		});
	}
}