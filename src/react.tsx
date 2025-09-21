import type { NonPostableEvt } from "evt";
import { useState, useCallback } from "react";
import { capitalize } from "tsafe/capitalize";
import { Reflect } from "tsafe/Reflect";
import { Deferred } from "evt/tools/Deferred";
import { useEvt } from "evt/hooks/useEvt";

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
    evtStateUpdated: NonPostableEvt<void>;
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
    let core: Core | undefined = undefined;

    function getCoreSync() {
        if (core === undefined) {
            throw dCore.pr;
        }

        return core;
    }

    function getCore() {
        return dCore.pr;
    }

    function triggerCoreBootstrap(params: ParamsOfBootstrapCore) {
        bootstrapCore(params).then(r => {
            core = r.core;
            dCore.resolve(core);
        });
    }

    function useCoreState(usecaseName: string, selectorName: string) {
        const core = getCoreSync();

        const getSelectedState = useCallback(
            () => core.states[usecaseName][`get${capitalize(selectorName)}`](),
            [usecaseName, selectorName]
        );

        const [selectedState, setSelectedState] = useState(() => getSelectedState());

        useEvt(
            ctx => {
                core.evtStateUpdated.attach(ctx, () => setSelectedState(getSelectedState()));
            },
            [getSelectedState]
        );

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
