import { assert } from "tsafe/assert";

type ThunksExtraArgumentLike = { evtAction: unknown };

export function createSliceContext<SliceContext extends Record<string, unknown>>() {
    const weakMap = new WeakMap<ThunksExtraArgumentLike, () => SliceContext>();

    function getSliceContext(extraArg: ThunksExtraArgumentLike): SliceContext {
        const getMemoizedSliceContext = weakMap.get(extraArg);

        assert(getMemoizedSliceContext !== undefined, "Slice context not initialized");

        return getMemoizedSliceContext();
    }

    function setSliceContext(
        extraArg: ThunksExtraArgumentLike,
        /** If it's a function it's evaluated only on first call */
        sliceContext: SliceContext | (() => SliceContext)
    ): void {
        const getSliceContextMemoized = (() => {
            let cachedSlice: SliceContext | undefined = undefined;

            return () => {
                if (cachedSlice !== undefined) {
                    return cachedSlice;
                }

                return (cachedSlice =
                    typeof sliceContext === "function" ? sliceContext() : sliceContext);
            };
        })();

        weakMap.set(extraArg, getSliceContextMemoized);
    }

    return { getSliceContext, setSliceContext };
}
