import { useContext, createContext, useState, useEffect, type ReactNode } from "react";
import { capitalize } from "tsafe/capitalize";
import { assert } from "tsafe/assert";

type StatesToHook<States extends Record<string, Record<string, any>>> = <
    UsecaseName extends keyof States,
    SelectorName extends keyof States[UsecaseName] extends `get${infer N}` ? Uncapitalize<N> : never
>(
    usecaseName: UsecaseName,
    selectorName: SelectorName
) => States[UsecaseName][`get${Capitalize<SelectorName>}`] extends (...args: any[]) => infer ReturnType
    ? ReturnType
    : never;

type CoreLike = {
    states: Record<string, Record<string, any>>;
    subscribe: (callback: () => void) => { unsubscribe: () => void };
};

type ReactApi<Core extends CoreLike, ParamsOfBootstrapCore> = {
    useCore: () => Core;
    useCoreState: StatesToHook<Core["states"]>;
    createCoreProvider: (params: ParamsOfBootstrapCore) => {
        CoreProvider: (props: { fallback?: ReactNode; children: ReactNode }) => JSX.Element;
    };
};

export function createReactApi<Core extends CoreLike, ParamsOfBootstrapCore>(params: {
    bootstrapCore: (params: ParamsOfBootstrapCore) => Promise<{ core: Core }>;
}): ReactApi<Core, ParamsOfBootstrapCore> {
    const { bootstrapCore } = params;

    const coreContext = createContext<Core | undefined>(undefined);

    function useCore() {
        const core = useContext(coreContext);

        assert(core !== undefined, `Must wrap your app within a <CoreProvider />`);

        return core;
    }

    function createCoreProvider(params: ParamsOfBootstrapCore) {
        const prCore = bootstrapCore(params).then(({ core }) => core);

        function CoreProvider(props: { fallback?: React.ReactNode; children: React.ReactNode }) {
            const { fallback, children } = props;

            const [core, setCore] = useState<Core | undefined>(undefined);

            useEffect(() => {
                let isActive = true;

                (async () => {
                    const core = await prCore;

                    if (!isActive) {
                        return;
                    }

                    setCore(core);
                })();

                return () => {
                    isActive = false;
                };
            }, []);

            if (core === undefined) {
                return <>{fallback ?? null}</>;
            }

            return <coreContext.Provider value={core}>{children}</coreContext.Provider>;
        }

        return { CoreProvider, prCore };
    }

    function useCoreState(usecaseName: string, selectorName: string) {
        const core = useCore();

        const getSelectedState = () => core.states[usecaseName][`get${capitalize(selectorName)}`]();

        const [selectedState, setSelectedState] = useState<any>(() => getSelectedState());

        useEffect(() => {
            const { unsubscribe } = core.subscribe(() => setSelectedState(getSelectedState()));

            return () => {
                unsubscribe();
            };
        }, [core]);

        return selectedState;
    }

    return {
        createCoreProvider,
        useCore,
        "useCoreState": useCoreState as any
    };
}
