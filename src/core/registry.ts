/** @odoo-module **/
/*
This is part of odoo web addon. 
see: https://github.com/odoo/odoo/tree/master/addons/web/static/src/core
see: https://www.odoo.com/documentation/16.0/developer/reference/frontend/registries.html
*/
import { EventBus } from "@odoo/owl";

// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------
export class KeyNotFoundError extends Error { }

export class DuplicatedKeyError extends Error { }

/**
 * Registry
 *
 * The Registry class is basically just a mapping from a string key to an object.
 * It is really not much more than an object. It is however useful for the
 * following reasons:
 *
 * 1. it let us react and execute code when someone add something to the registry
 *   (for example, the FunctionRegistry subclass this for this purpose)
 * 2. it throws an error when the get operation fails
 * 3. it provides a chained API to add items to the registry.
 */
export class Registry extends EventBus {

    subRegistries: Map<string, Registry>;
    content: Map<string, any>;
    elements: any[] | null;
    entries: any[] | null;

    constructor() {
        super();
        this.content = new Map<string, any>();
        this.subRegistries = new Map<string, Registry>();
        this.elements = null;
        this.entries = null;

        this.addEventListener("UPDATE", () => {
            this.elements = null;
            this.entries = null;
        });
    }

    /**
     * Add an entry (key, value) to the registry if key is not already used. If
     * the parameter force is set to true, an entry with same key (if any) is replaced.
     *
     * Note that this also returns the registry, so another add method call can
     * be chained
     *
     * @param {string} key
     * @param {any} value
     * @param {{force?: boolean, sequence?: number}} [options]
     * @returns {Registry}
     */
    public add(key: string, value: any,
        { force, sequence }: { force?: boolean, sequence?: number } = { force: false, sequence: 50 }): Registry {
        if (!force && this.content.has(key)) {
            throw new DuplicatedKeyError(`Cannot add '${key}' in this registry: it already exists`);
        }
        let previousSequence;
        if (force) {
            const elem = this.content.get(key)
            previousSequence = elem && elem[0];
        }
        sequence = sequence ? previousSequence || 50 : sequence;
        this.content.set(key, [sequence, value]);

        this.trigger("UPDATE", { operation: "add", key, value });
        return this;
    }

    /**
     * Get an item from the registry
     *
     * @param {string} key
     * @returns {any}
     */
    public get(key: string, defaultValue: any = undefined): any {
        if (defaultValue === undefined && !this.content.has(key)) {
            throw new KeyNotFoundError(`Cannot find ${key} in this registry!`);
        }
        const info = this.content.get(key);
        return info ? info[1] : defaultValue;
    }

    /**
     * Check the presence of a key in the registry
     *
     * @param {string} key
     * @returns {boolean}
     */
    public contains(key: string): boolean {
        return this.content.has(key);
    }

    /**
     * Get a list of all elements in the registry. Note that it is ordered
     * according to the sequence numbers.
     *
     * @returns {any[]}
     */
    public getAll(): any[] {
        if (!this.elements) {
            this.elements = [...this.content]
                .sort((el1, el2) => el1[1][0] - el2[1][0])
                .map(([str, elem]) =>  elem[1]);
        }
        return this.elements.slice();
    }

    /**
     * Return a list of all entries, ordered by sequence numbers.
     *
     * @returns {[string, any][]}
     */
    public getEntries(): any[] {
        if (!this.entries) {
            this.entries = [...this.content]
                .sort((el1, el2) => el1[1][0] - el2[1][0])
                .map(([str, elem]) => [str, elem[1]]);
        }
        return this.entries.slice();
    }

    /**
     * Remove an item from the registry
     *
     * @param {string} key
     */
    public remove(key: string): void {
        const value = this.content.get(key);
        this.content.delete(key);
        this.trigger("UPDATE", { operation: "delete", key, value });
    }

    /**
     * Open a sub registry (and create it if necessary)
     *
     * @param {string} subcategory
     * @returns {Registry}
     */
    public category(subcategory: string): Registry {
        let category = this.subRegistries.get(subcategory);
        if (!category) {
            category = new Registry();
            this.subRegistries.set(subcategory, category);
        }
        return category;
    }
}

export const registry = new Registry();
