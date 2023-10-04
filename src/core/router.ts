import {
	Component,
	xml,
	useState,
	onRendered
} from "@odoo/owl";
import { registry } from "./registry";

const TITLE_DEFAULT = "OWL Router";

const ROUTER_TYPES = {
	hash: "hash",
	history: "history"
};

function defer(x: Function) {
	setTimeout(() => x(), 10);
}


/**
Makes the path more secure to use.
 */
function sanitizePath(path: string) {
	return path.toString().replace(/\/$/, '').replace(/^\//, '');
}


export class Events {
	host: any;
	constructor(host: any) {
		this.host = host;
	}

	trigger(event: any, detail: any, ev?: any) {
		if (typeof (event) === "object" && event instanceof Event) {
			return this.host.dispatchEvent(event);
		}

		if (!ev) {
			ev = new Event(event, { bubbles: false, cancelable: true });
		}

		ev.detail = { ...(detail || {}), host: this.host };

		return this.host.dispatchEvent(ev);
	}
}


export class Router extends Component {
	static template = xml`<t t-component="currentComponent"/>`;
	static props = ["routes", "type", "id"];
	static defaultProps = {
		type: ROUTER_TYPES.hash
	}
	events: Events;
	routerType: string = ROUTER_TYPES.hash;
	state = useState({ child: "a" });


	eventTarget = document.createDocumentFragment();


	public removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean) {
		this.eventTarget.removeEventListener(type, callback, options);
	}

	public dispatchEvent(event: Event): boolean {
		return this.eventTarget.dispatchEvent(event);
	}

	public addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
		this.eventTarget.addEventListener(type, callback, options);
	}


	public setup(): void {
		this.events = new Events(this);
		// lesten on route change
		this.listen().on("route", (evt: Event) => {
			return this.render();
		});
	}

	get currentComponent() {
		return this._currentRoute;
	}

	get routes() {
		return this.props.routes;
	}

	get isHashRouter() {
		return this.routerType === ROUTER_TYPES.hash;
	}

	public on(type: string, callback: EventListenerOrEventListenerObject | null): Router {
		this.addEventListener(type, callback);
		return this;
	}

	/**
	 * Makes the router navigate to the given route
	 * @param {String} path 
	 */
	setRoute(path) {
		if (!this._findRoute(path)) {
			throw TypeError("Route not found");
		}
		let href = this.isHashRouter ? '#' + path : document.location.origin + path;
		history.replaceState(null, '', href);
		this._tryNav(href);
	}

	/**
	 * Start listening for route changes.
	 * @returns {Router} reference to itself.
	 */
	public listen(): Router {
		// Check if home page exist
		if (!this._findRoute('/')) {
			throw TypeError("No home route found");
		}

		if (this.isHashRouter) {
			window.addEventListener('hashchange', this._hashChanged.bind(this));
			defer(() => this._tryNav(document.location.hash.substr(1)));
		} else {
			let href = document.location.origin;
			if (this._findRoute(document.location.pathname)) {
				href += document.location.pathname;
			}
			// document.addEventListener("click", this._onNavClick.bind(this));
			window.addEventListener("popstate", this._triggerPopState.bind(this));

			defer(() => this._tryNav(href));
		}
		return this;
	}


	private _hashChanged() {
		this._tryNav(document.location.hash.substr(1))
	}

	private _triggerPopState(e: any) {
		let path = e?.state?.path;
		if (!path) {
			// manual path edit
			path = window.location.hash.substr(1);
		}
		this._triggerRouteChange(path, e.target.location.href);
	}

	private _triggerRouteChange(path: string, url: any) {
		this.events.trigger("route", {
			route: this._findRoute(path),
			path: path,
			url: url
		})
	}

	private _findRoute(path: string, defaultRoute: any = null) {
		// TODO: support path not fount component
		return registry.category('pages').get(path) || defaultRoute;
	}

	private _tryNav(href: string) {
		const url = this._createUrl(href);
		if (url.protocol.startsWith("http")) {
			const routeComponent = this._findRoute(url.pathname);
			if (routeComponent) {
				if (this.routerType === "history") {
					window.history.pushState({ path: routeComponent.route }, '', url.origin + url.pathname);
				}
				this._triggerRouteChange(routeComponent.route, url);
				return true;
			}
		}
	}

	private _createUrl(href: string) {
		if (this.isHashRouter && href.startsWith("#")) {
			href = href.substr(1);
		}
		return new URL(href, document.location.origin)
	}

	private get _currentRoute() {
		// Check if the route type is not hash, then throw error
		let path = window.location.hash || '#/';
		path = path.substr(1);
		// TODO: support path not fount component
		return this._findRoute(path, this.routes[0]);
	}

}

