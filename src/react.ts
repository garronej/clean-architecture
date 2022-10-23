import { useState, useEffect } from "react";
import type { UsecasesApi, UsecaseLike } from "./createUsecasesApi";
import type { CoreLike as CoreLike_functions } from "./usecasesToFunctions";
import type { CoreLike as CoreLike_evts } from "./usecasesToEvts";

type CoreLike<Usecase extends UsecaseLike> = CoreLike_functions<Usecase> &
    CoreLike_evts & {
        subscribe: (listener: () => void) => () => void;
    };

export function createReactApi<Usecase extends UsecaseLike, Core extends CoreLike<Usecase>>(params: {
    useCore: () => Core;
    usecasesApi: UsecasesApi<Usecase>;
}) {
    const { useCore, usecasesApi } = params;

    const { selectors, getMemoizedCoreEvts, getMemoizedCoreFunctions } = usecasesApi;

    type State = ReturnType<Core["getState"]>;

    function useCoreState<T>(selector: (state: State) => T): T {
        const core = useCore();

        const [state, setState] = useState(core.getState);

        useEffect(() => core.subscribe(() => setState(core.getState())), [core]);

        return selector(state);
    }

    function useCoreFunctions() {
        const core = useCore();

        return getMemoizedCoreFunctions(core);
    }

    function useCoreEvts() {
        const core = useCore();

        return getMemoizedCoreEvts(core);
    }

    return { selectors, useCoreState, useCoreFunctions, useCoreEvts };
}
