import { assert } from "tsafe/assert";

type ThunksExtraArgumentLike = { evtAction: unknown };

type UsecaseContextApi<SliceContext extends Record<string, unknown>> = {
    getUsecaseContext: (extraArg: ThunksExtraArgumentLike) => SliceContext;
    setUsecaseContext: (extraArg: ThunksExtraArgumentLike, sliceContext: SliceContext) => void;
};

export function createUsecaseContext<
    SliceContext extends Record<string, unknown>
>(): UsecaseContextApi<SliceContext>;
export function createUsecaseContext<SliceContext extends Record<string, unknown>>(
    getInitialSliceContext: () => SliceContext
): Omit<UsecaseContextApi<SliceContext>, "setSliceContext">;
export function createUsecaseContext<SliceContext extends Record<string, unknown>>(
    getInitialSliceContext?: () => SliceContext
): UsecaseContextApi<SliceContext> {
    const weakMap = new WeakMap<ThunksExtraArgumentLike, () => SliceContext>();

    function getUsecaseContext(extraArg: ThunksExtraArgumentLike): SliceContext {
        let getMemoizedSliceContext = weakMap.get(extraArg);

        if (getMemoizedSliceContext !== undefined) {
            return getMemoizedSliceContext();
        }

        assert(getInitialSliceContext !== undefined, "Slice context not initialized");

        getMemoizedSliceContext = memoize(getInitialSliceContext);

        weakMap.set(extraArg, getMemoizedSliceContext);

        return getMemoizedSliceContext();
    }

    function setUsecaseContext(
        extraArg: ThunksExtraArgumentLike,
        /** If it's a function it's evaluated only on first call */
        sliceContext: SliceContext | (() => SliceContext)
    ): void {
        weakMap.set(
            extraArg,
            memoize(typeof sliceContext === "function" ? sliceContext : () => sliceContext)
        );
    }

    return { getUsecaseContext, setUsecaseContext };
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
