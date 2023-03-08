const keyIsTrapped = "isTrapped_zSskDe9d";

export function createObjectThatThrowsIfAccessed<T extends object>(params?: {
    debugMessage?: string;
    isPropertyWhitelisted?: (prop: string | number | symbol) => boolean;
}): T {
    const { debugMessage = "", isPropertyWhitelisted = () => false } = params ?? {};

    const get: NonNullable<ProxyHandler<T>["get"]> = (...args) => {
        const [, prop] = args;

        if (isPropertyWhitelisted(prop)) {
            return Reflect.get(...args);
        }

        if (prop === keyIsTrapped) {
            return true;
        }

        throw new Error(`Cannot access ${String(prop)} yet ${debugMessage}`);
    };

    const trappedObject = new Proxy<T>({} as any, {
        get,
        "set": get
    });

    return trappedObject;
}

export function createObjectThatThrowsIfAccessedFactory(params: {
    isPropertyWhitelisted?: (prop: string | number | symbol) => boolean;
}) {
    const { isPropertyWhitelisted } = params;

    return {
        "createObjectThatThrowsIfAccessed": <T extends object>(params?: { debugMessage?: string }) => {
            const { debugMessage } = params ?? {};

            return createObjectThatThrowsIfAccessed<T>({
                debugMessage,
                isPropertyWhitelisted
            });
        }
    };
}

export function isObjectThatThrowIfAccessed(obj: object) {
    return (obj as any)[keyIsTrapped] === true;
}

export function createPropertyThatThrowIfAccessed<T extends object, PropertyName extends keyof T>(
    propertyName: PropertyName,
    debugMessage?: string
): { [K in PropertyName]: T[K] } {
    const getAndSet = () => {
        throw new Error(`Cannot access ${String(propertyName)} yet ${debugMessage ?? ""}`);
    };

    return Object.defineProperty({} as any, propertyName, {
        "get": getAndSet,
        "set": getAndSet,
        "enumerable": true
    });
}
