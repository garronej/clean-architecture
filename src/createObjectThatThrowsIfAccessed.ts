import { createObjectThatThrowsIfAccessedFactory } from "./tools/createObjectThatThrowsIfAccessed";

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
