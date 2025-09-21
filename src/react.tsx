import { useState, useEffect } from "react";
import { capitalize } from "tsafe/capitalize";
import { Reflect } from "tsafe/Reflect";
import { Deferred } from "evt/tools/Deferred";
import { createForwardingProxy } from "./tools/createForwardingProxy";

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

const fpGetCoreSync = createForwardingProxy<ReactApi<CoreLike, any>["getCoreSync"]>({
    isFunction: true
});
const fpGetCore = createForwardingProxy<ReactApi<CoreLike, any>["getCore"]>({ isFunction: true });
const fpTriggerCoreBootstrap = createForwardingProxy<ReactApi<CoreLike, any>["triggerCoreBootstrap"]>({
    isFunction: true
});
const fpUseCoreState = createForwardingProxy<ReactApi<CoreLike, any>["useCoreState"]>({
    isFunction: true
});

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

        const [, setSelectedState] = useState<any>(() => getSelectedState());

        useEffect(() => {
            const { unsubscribe } = core.subscribe(() => setSelectedState(getSelectedState()));

            setSelectedState(getSelectedState());

            return () => {
                unsubscribe();
            };
        }, [core]);

        return getSelectedState();
    }

    fpGetCoreSync.updateTarget(getCoreSync);
    fpGetCore.updateTarget(getCore);
    fpTriggerCoreBootstrap.updateTarget(triggerCoreBootstrap);
    fpUseCoreState.updateTarget(useCoreState);

    return {
        ofTypeCore: Reflect<Core>(),
        getCoreSync: fpGetCoreSync.proxy as any,
        getCore: fpGetCore.proxy as any,
        triggerCoreBootstrap: fpTriggerCoreBootstrap.proxy,
        useCoreState: fpUseCoreState.proxy
    };
}
