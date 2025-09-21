import type { NonPostableEvt } from "evt";
import { useState } from "react";
import { capitalize } from "tsafe/capitalize";
import { Reflect } from "tsafe/Reflect";
import { Deferred } from "evt/tools/Deferred";
import { createForwardingProxy } from "./tools/createForwardingProxy";
import { useEvt } from "evt/hooks/useEvt";
import { arrPartition } from "evt/tools/reducers/partition";
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
    evtStateUpdated: NonPostableEvt<void>;
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

const ctxsOfUseCoreState = new WeakSet<object>();
let core_previous: CoreLike | undefined = undefined;

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
        bootstrapCore(params).then(({ core: core_scope }) => {
            transfer_handlers: {
                if (core_previous === undefined) {
                    break transfer_handlers;
                }

                const [handlers_internal, handlers_external] = arrPartition(
                    core_previous.evtStateUpdated.detach(),
                    handler => handler.ctx !== undefined && ctxsOfUseCoreState.has(handler.ctx)
                );

                if (handlers_external.length !== 0) {
                    console.warn([
                        `clean-architecture: HMR warning, since you have attached event`,
                        `handlers to core.evtStateUpdated you might experience bugs due to`,
                        `the core having been hot replaced.`
                    ]);
                }

                handlers_internal.forEach(({ ctx, callback }) => {
                    assert(ctx !== undefined);
                    assert(callback !== undefined);
                    core_scope.evtStateUpdated.attach(ctx, callback);
                });
            }
            core_previous = core_scope;
            core = core_scope;
            dCore.resolve(core_scope);
        });
    }

    fpGetCoreSync.updateTarget(getCoreSync);
    fpGetCore.updateTarget(getCore);
    fpTriggerCoreBootstrap.updateTarget(triggerCoreBootstrap);

    return {
        ofTypeCore: Reflect<Core>(),
        getCoreSync: fpGetCoreSync.proxy as any,
        getCore: fpGetCore.proxy as any,
        triggerCoreBootstrap: fpTriggerCoreBootstrap.proxy,
        useCoreState: useCoreState as any
    };
}

function useCoreState(usecaseName: string, selectorName: string) {
    const getSelectedState = () =>
        fpGetCoreSync.proxy().states[usecaseName][`get${capitalize(selectorName)}`]();

    const [, reRenderIfStateChanged] = useState<any>(() => getSelectedState());

    const core = fpGetCoreSync.proxy();

    useEvt(ctx => {
        ctxsOfUseCoreState.add(ctx);

        core.evtStateUpdated.attach(ctx, () => {
            reRenderIfStateChanged(getSelectedState());
        });
    }, []);

    return getSelectedState();
}
