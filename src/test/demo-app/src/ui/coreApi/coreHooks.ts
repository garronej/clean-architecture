import { useState, useEffect } from "react";
import { usecasesApi } from "core";
import type { State } from "core";
import { useCore } from "./CoreProvider";

const { getMemoizedCoreEvts, getMemoizedCoreFunctions } = usecasesApi;

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
