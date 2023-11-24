import { assert } from "tsafe/assert";

export type RootContextLike = { evtAction: unknown };

type ContextApi<Context extends Record<string, unknown>> = {
    getContext: (rootContext: RootContextLike) => Context;
    setContext: (rootContext: RootContextLike, context: Context | (() => Context)) => void;
    getIsContextSet: (rootContext: RootContextLike) => boolean;
};

export function createUsecaseContextApi<Context extends Record<string, unknown>>(): ContextApi<Context>;
export function createUsecaseContextApi<Context extends Record<string, unknown>>(
    getInitialContext: () => Context
): Omit<ContextApi<Context>, "setContext" | "getIsContextSet">;
export function createUsecaseContextApi<context extends Record<string, unknown>>(
    getInitialContext?: () => context
): ContextApi<context> {
    const weakMap = new WeakMap<RootContextLike, () => context>();

    return {
        "getContext": rootContext => {
            let getMemoizedContext = weakMap.get(rootContext);

            if (getMemoizedContext !== undefined) {
                return getMemoizedContext();
            }

            assert(getInitialContext !== undefined, "Slice context not initialized");

            getMemoizedContext = memoize(getInitialContext);

            weakMap.set(rootContext, getMemoizedContext);

            return getMemoizedContext();
        },
        "setContext": (rootContext, context) =>
            weakMap.set(rootContext, memoize(typeof context === "function" ? context : () => context)),
        "getIsContextSet": rootContext => weakMap.has(rootContext)
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
