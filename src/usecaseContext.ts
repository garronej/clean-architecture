import { assert } from "tsafe/assert";

export type ThunksExtraArgumentLike = { evtAction: unknown };

type ContextApi<Context extends Record<string, unknown>> = {
    getContext: (extraArg: ThunksExtraArgumentLike) => Context;
    setContext: (extraArg: ThunksExtraArgumentLike, context: Context | (() => Context)) => void;
};

export function createUsecaseContextApi<Context extends Record<string, unknown>>(): ContextApi<Context>;
export function createUsecaseContextApi<Context extends Record<string, unknown>>(
    getInitialContext: () => Context
): Omit<ContextApi<Context>, "setContext">;
export function createUsecaseContextApi<context extends Record<string, unknown>>(
    getInitialContext?: () => context
): ContextApi<context> {
    const weakMap = new WeakMap<ThunksExtraArgumentLike, () => context>();

    return {
        "getContext": extraArg => {
            let getMemoizedContext = weakMap.get(extraArg);

            if (getMemoizedContext !== undefined) {
                return getMemoizedContext();
            }

            assert(getInitialContext !== undefined, "Slice context not initialized");

            getMemoizedContext = memoize(getInitialContext);

            weakMap.set(extraArg, getMemoizedContext);

            return getMemoizedContext();
        },
        "setContext": (extraArg, context) =>
            weakMap.set(extraArg, memoize(typeof context === "function" ? context : () => context))
    };
}

function memoize<R extends Record<string, unknown>>(fn: () => R): () => R {
    let cache: R | undefined = undefined;

    return () => {
        if (cache !== undefined) {
            return cache;
        }

        return (cache = fn());
    };
}
