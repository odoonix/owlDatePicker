import { Component, useState } from "@odoo/owl";

import { components, template } from "../core/components";
import { Footer } from "../core/footer";
import { MainComponentsContainer } from "../core/main_components_container";
import { Router } from "../core/router";
import { Sidebar } from "../core/sidebar";
import { Navbar } from "./navbar";


import "./webclient.scss";
import "./webclient.xml";

/**
 * Root component of the application
 * 
 * This is the mani module and responsilbe to launch the app.
 */
@components({
	Footer,
	Sidebar,
	Navbar,
	Router,
	MainComponentsContainer
})
@template("web.WebClient")
export class WebClient extends Component {

	state?: {
		title: string
	};
	routeType: string;
	routes: any;

	public setup(): void {
		this.routeType = 'hash';
		this.state = useState({
			title: ''
		});
		this.routes = [];
	}
}
