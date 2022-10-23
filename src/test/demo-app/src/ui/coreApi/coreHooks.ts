import { useState, useEffect } from "react";
import { getMemoizedCoreEvts, getMemoizedCoreFunctions } from "core";
import type { State } from "core";
import { useCore } from "./CoreProvider";

export function useCoreState<T>(selector: (state: State) => T): T {

    const core = useCore();

    const [state, setState] = useState(core.getState);

    useEffect(
        () => core.subscribe(() => setState(core.getState())),
        [core]
    );

    return selector(state);

}

export function useCoreFunctions() {

    const core = useCore();

    return getMemoizedCoreFunctions(core);
}

export function useCoreEvts() {

    const core = useCore();

    return getMemoizedCoreEvts(core);

}
