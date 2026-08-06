import {
    createObjectThatThrowsIfAccessedFactory,
    isObjectThatThrowIfAccessed,
    AccessError,
    THROW_IF_ACCESSED,
    createObjectWithSomePropertiesThatThrowIfAccessed
} from "./tools/createObjectThatThrowsIfAccessed";
export {
    isObjectThatThrowIfAccessed,
    THROW_IF_ACCESSED,
    createObjectWithSomePropertiesThatThrowIfAccessed
};

export { AccessError };

function isPropertyAccessedByReduxOrStorybook(prop: string | number | symbol) {
    switch (typeof prop) {
        case "symbol":
            return ["Symbol.toStringTag", "immer-state"].map(s => `Symbol(${s})`).includes(String(prop));
        case "string":
            return ["window", "toJSON"].includes(prop);
        case "number":
            return false;
    }
}

export const { createObjectThatThrowsIfAccessed } = createObjectThatThrowsIfAccessedFactory({
    "isPropertyWhitelisted": isPropertyAccessedByReduxOrStorybook
});
