import { registry } from "./registry";

export const route = (path: string) => {
    return (target: any) => {
        target.route = path;
        registry.category('pages').add(path, target);
    }
}

export const template = (name: string) => {
    return (target: any) => {
        target.template = name;
    }
}

export const logo = (path: string) => {
    return (target: any) => {
        target.logo = path;
    }
}

export const title = (title: string) => {
    return (target: any) => {
        target.title = title;
    }
}

export const symbol = (name: string) => {
    return (target: any) => {
        target.symbol = name;
    }
}

export const enableStaking = () => {
    return (target: any) => {
        target.enableStaking = true;
    }
}


export function usePage(path: string, page: any) {
    // TODO;;
    registry.category('pages').add(path, page);
}