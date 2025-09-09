import { useState, useEffect } from "react";
import { capitalize } from "tsafe/capitalize";
import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import { Deferred } from "evt/tools/Deferred";

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
    ofTypeCore: Core;
    useCore: () => Core;
    getCore: () => Promise<Core>;
    getCoreSync: () => Core;
    useCoreState: StatesToHook<Core["states"]>;
    bootstrapCore: (params: ParamsOfBootstrapCore) => void;
};

const prReactApiByBootstrapCore = k;

export function createReactApi<Core extends CoreLike, ParamsOfBootstrapCore>(params: {
    bootstrapCore: (params: ParamsOfBootstrapCore) => Promise<{ core: Core }>;
}): ReactApi<Core, ParamsOfBootstrapCore> {
    const { bootstrapCore } = params;

    const dCore = new Deferred<Core>();
    let core: Core | undefined = undefined;

    dCore.pr.then(value => (core = value));

    function getCoreSync() {
        if (core === undefined) {
            throw dCore.pr;
        }

        return core;
    }

    let hasBootstrapCoreReactBeenCalled = function bootstrapCoreReact(params: ParamsOfBootstrapCore) {};

    function createCoreProvider(params: ParamsOfBootstrapCore) {
        bootstrapCore(params).then(({ core }) => dCore.resolve(core));

        function CoreProvider(props: { fallback?: React.ReactNode; children: React.ReactNode }) {
            const { fallback, children } = props;

            const [core, setCore] = useState<Core | undefined>(undefined);

            useEffect(() => {
                let isActive = true;

                (async () => {
                    const core = await dCore.pr;

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

        return { CoreProvider };
    }

    function useCoreState(usecaseName: string, selectorName: string) {
        const core = useCore();

        const getSelectedState = () => core.states[usecaseName][`get${capitalize(selectorName)}`]();

        const [selectedState, setSelectedState] = useState<any>(() => getSelectedState());

        useEffect(() => {
            const { unsubscribe } = core.subscribe(() => setSelectedState(getSelectedState()));

            setSelectedState(getSelectedState());

            return () => {
                unsubscribe();
            };
        }, [core]);

        return selectedState;
    }

    function getCore(): Promise<Core> {
        return dCore.pr;
    }

    return {
        ofTypeCore: Reflect<Core>(),
        createCoreProvider,
        useCore,
        "useCoreState": useCoreState as any,
        getCore
    };
}
