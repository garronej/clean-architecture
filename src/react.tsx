import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { UsecaseLike as UsecaseLike_create } from "./createUsecasesApi";
import { assert } from "tsafe/assert";
import { useEvt } from "evt/hooks/useEvt";
import type { GetMemoizedCoreFunctions } from "./usecasesToFunctions";
import type { UsecaseLike as UseCaseLike_reducer } from "./usecasesToReducer";
import type { GenericCore } from "./createCore";
import type { UsecaseLike as UsecaseLike_evt } from "./middlewareEvtAction";
import type { GetMemoizedCoreEvts } from "./usecasesToEvts";
import type { GenericSelectors } from "./usecasesToSelectors";
import { createUsecasesApi } from "./createUsecasesApi";

type UsecaseLike = UsecaseLike_create & UseCaseLike_reducer & UsecaseLike_evt;

type ReactApi<
    CoreParams extends Record<string, unknown>,
    Usecase extends UsecaseLike,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
> = {
    createCoreProvider: (coreParams: CoreParams | (() => CoreParams)) => {
        CoreProvider: (props: {
            children: ReactNode;
            fallback?: NonNullable<ReactNode> | null;
        }) => JSX.Element | null;
    };
    selectors: GenericSelectors<Usecase>;
    useCoreState: <T>(
        selector: (
            state: ReturnType<GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase>["getState"]>
        ) => T
    ) => T;
    useCoreFunctions: () => ReturnType<GetMemoizedCoreFunctions<Usecase>>;
    useCoreEvts: () => ReturnType<GetMemoizedCoreEvts<Usecase>>;
    useCoreExtras: () => GenericCore<
        ThunksExtraArgumentWithoutEvtAction,
        Usecase
    >["thunksExtraArgument"];
    /** @deprecated: There should be no need to access the core directly */
    useCore: () => GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase>;
};

export function createReactApi<
    CoreParams extends Record<string, unknown>,
    Usecase extends UsecaseLike,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
>(params: {
    createCore: (
        params: CoreParams
    ) => Promise<GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase>>;
    usecases: Record<string, Usecase>;
}): ReactApi<CoreParams, Usecase, ThunksExtraArgumentWithoutEvtAction> {
    const { createCore, usecases } = params;

    const { selectors, getMemoizedCoreEvts, getMemoizedCoreFunctions } = createUsecasesApi(
        Object.values(usecases)
    );

    type Core = GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase>;

    const coreContext = createContext<Core | undefined>(undefined);

    function useCore() {
        const core = useContext(coreContext);
        assert(core !== undefined, "Not wrapped within CoreProvider");
        return core;
    }

    function createCoreProvider(coreParamsOrGetCoreParams: CoreParams | (() => CoreParams)) {
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

        return selector(state as any);
    }

    function useCoreFunctions() {
        const core = useCore();

        return getMemoizedCoreFunctions(core as any);
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
        useCoreExtras,
        useCore
    };
}
