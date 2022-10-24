import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { UsecasesApi, UsecaseLike } from "./createUsecasesApi";
import type { CoreLike as CoreLike_functions } from "./usecasesToFunctions";
import type { CoreLike as CoreLike_evts } from "./usecasesToEvts";
import { assert } from "tsafe/assert";
import { useEvt } from "evt/hooks/useEvt";

type CoreLike<Usecase extends UsecaseLike> = CoreLike_functions<Usecase> & CoreLike_evts;

export function createReactApi<
    CoreParams extends Record<string, unknown>,
    Usecase extends UsecaseLike,
    Core extends CoreLike<Usecase>
>(params: { createCore: (params: CoreParams) => Promise<Core>; usecasesApi: UsecasesApi<Usecase> }) {
    const { createCore, usecasesApi } = params;

    const { selectors, getMemoizedCoreEvts, getMemoizedCoreFunctions } = usecasesApi;

    const coreContext = createContext<Core | undefined>(undefined);

    function useCore() {
        const core = useContext(coreContext);
        assert(core !== undefined, "Not wrapped within CoreProvider");
        return core;
    }

    function createCoreProvider(params: { coreParams: CoreParams | (() => CoreParams) }) {
        const { coreParams: coreParamsOrGetCoreParams } = params;

        const getCoreParams =
            typeof coreParamsOrGetCoreParams === "function"
                ? coreParamsOrGetCoreParams
                : () => coreParamsOrGetCoreParams;

        type Props = {
            children: ReactNode;
            fallback?: NonNullable<ReactNode> | null;
        };

        let prCore: Promise<Core> | undefined = undefined;

        function CoreProvider(props: Props) {
            const { children, fallback } = props;

            const [core, setCore] = useState<Core | undefined>(undefined);

            useEffect(() => {
                if (prCore === undefined) {
                    prCore = createCore(getCoreParams());
                }

                let isCleanedUp = false;

                prCore.then(core => {
                    if (isCleanedUp) {
                        return;
                    }
                    setCore(core);
                });

                return () => {
                    isCleanedUp = true;
                };
            }, []);

            if (core === undefined) {
                return (fallback ?? null) as null;
            }

            return <coreContext.Provider value={core}>{children}</coreContext.Provider>;
        }

        return { CoreProvider };
    }

    type State = ReturnType<Core["getState"]>;

    function useCoreState<T>(selector: (state: State) => T): T {
        const core = useCore();

        const [state, setState] = useState(core.getState);

        useEvt(
            ctx => core.thunksExtraArgument.evtAction.attach(ctx, () => setState(core.getState())),
            [core]
        );

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

    function useCoreExtras() {
        const core = useCore();

        return core.thunksExtraArgument;
    }

    return {
        createCoreProvider,
        selectors,
        useCoreState,
        useCoreFunctions,
        useCoreEvts,
        useCoreExtras
    };
}
