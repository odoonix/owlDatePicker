import {
	Component,
	useState,
} from "@odoo/owl";
import { v4 as uuidv4 } from 'uuid';
import { registry } from "../registry";

import "./sidebar.xml";
import "./sidebar.scss";

export class SidebarBrand extends Component {
	static template = "components.sidebar.brand";
}


export class SidebarCollapse extends Component {

	static template = "components.sidebar.collapse";

	id: string;
	sid: string;

	public setup(): void {
		this.id = 'collapse' + uuidv4().replaceAll('\-', '');
		this.sid = '#' + this.id;
	}
}

export class SidebarDivider extends Component {
	static template = "components.sidebar.divider";
}

export class SidebarHeading extends Component {
	static template = "components.sidebar.heading";
}

export class SidebarLink extends Component {
	static template = "components.sidebar.link";
	static props = ['title', 'href'];
}

export class SidebarMessage extends Component {
	static template = "components.sidebar.message";
}

export class Sidebar extends Component {
	static template = "components.sidebar";
	static components = {
		SidebarBrand,
		SidebarDivider,
		SidebarLink,
		SidebarMessage,
		SidebarHeading,
		SidebarCollapse,
	};
	state:{
		pages: Component[],
	} = useState({
		pages: [],
	});


	public setup(): void {
		// Load all routs
		this.state.pages = registry.category('pages').getAll();
		registry.category('pages').addEventListener("UPDATE", () => {
			this.state.pages = registry.category('pages').getAll();
		});
	}

}
