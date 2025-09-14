import { useState, useEffect } from "react";
import { capitalize } from "tsafe/capitalize";
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
    getCoreSync: () => Core;
    getCore: () => Promise<Core>;
    useCoreState: StatesToHook<Core["states"]>;
    triggerCoreBootstrap: (params: ParamsOfBootstrapCore) => void;
};

export function createReactApi<Core extends CoreLike, ParamsOfBootstrapCore>(params: {
    bootstrapCore: (params: ParamsOfBootstrapCore) => Promise<{ core: Core }>;
}): ReactApi<Core, ParamsOfBootstrapCore> {
    const { bootstrapCore } = params;

    const dCore = new Deferred<Core>();

    const { getCoreSync } = (() => {
        let core: Core | undefined = undefined;

        dCore.pr.then(value => (core = value));

        function getCoreSync() {
            if (core === undefined) {
                throw dCore.pr;
            }

            return core;
        }

        return { getCoreSync };
    })();

    function getCore() {
        return dCore.pr;
    }

    function triggerCoreBootstrap(params: ParamsOfBootstrapCore) {
        bootstrapCore(params).then(({ core }) => dCore.resolve(core));
    }

    function useCoreState(usecaseName: string, selectorName: string) {
        const core = getCoreSync();

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

    return {
        ofTypeCore: Reflect<Core>(),
        getCoreSync,
        getCore,
        triggerCoreBootstrap,
        useCoreState: useCoreState as any
    };
}
