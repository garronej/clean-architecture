import type { Thunks } from "../bootstrap";

export const name = "usecase3";

export const reducer = null;

export const thunks = {
    "thunkZ":
        (params: { pZ: string }) =>
        (...args) => {
            const { pZ } = params;
            const [, getState] = args;

            return pZ + getState().usecase1.counter;
        }
} satisfies Thunks;
