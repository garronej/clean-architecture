import type { NonPostableEvt } from "evt";
import type { ReturnType } from "tsafe";
import { assert, is } from "tsafe/assert";
import { id } from "tsafe/id";

import { createStore, type GenericStore, type UsecaseLike as UsecaseLike_store } from "./createStore";

import {
    usecasesToEvts,
    type CoreEvts,
    type GenericCreateEvt,
    type UsecaseLike as UsecaseLike_evts
} from "./usecasesToEvts";
import {
    usecasesToStates,
    type CoreStates,
    type UsecaseLike as UsecaseLike_selectors
} from "./usecasesToStates";
import {
    usecasesToFunctions,
    CoreFunctions,
    type UsecaseLike as UsecaseLike_functions
} from "./usecasesToFunctions";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import type { RootContextLike } from "./usecaseContext";

type UsecaseLike = UsecaseLike_store & UsecaseLike_evts & UsecaseLike_selectors & UsecaseLike_functions;

export type GenericCore<
    Usecases extends Record<string, UsecaseLike>,
    Context extends Record<string, unknown>
> = {
    states: CoreStates<Usecases[keyof Usecases]>;
    evtStateUpdated: NonPostableEvt<void>;
    evts: CoreEvts<Usecases[keyof Usecases]>;
    functions: CoreFunctions<Usecases[keyof Usecases]>;
    types: {
        State: ReturnType<GenericStore<Context, Usecases[keyof Usecases]>["getState"]>;
        CreateEvt: GenericCreateEvt<GenericStore<Context, Usecases[keyof Usecases]>>;
        Thunks: Record<
            string,
            (params: any) => ThunkAction<
                any,
                ReturnType<GenericStore<Context, Usecases[keyof Usecases]>["getState"]>,
                Context & {
                    evtAction: GenericStore<Context, Usecases[keyof Usecases]>["evtAction"];
                },
                Action<string>
            >
        >;
    };
};

export function createCore<
    Usecases extends Record<string, UsecaseLike>,
    Context extends Record<string, unknown>
>(params: {
    context: Context;
    usecases: Usecases;
}): {
    core: GenericCore<Usecases, Context>;
    dispatch: GenericStore<Context, Usecases[keyof Usecases]>["dispatch"];
    getState: GenericStore<Context, Usecases[keyof Usecases]>["getState"];
    evtAction: GenericStore<Context, Usecases[keyof Usecases]>["evtAction"];
} {
    const { context, usecases } = params;

    Object.entries(usecases).forEach(([key, usecase]) => {
        assert(
            key === usecase.name,
            `You should reconcile the name of the usecase (${usecase.name}) and the key it's assigned to in the usecases object (${key})`
        );
    });

    const usecasesArr = Object.values(usecases) as Usecases[keyof Usecases][];

    const store = createStore({ context, usecasesArr });
    assert(is<Context & RootContextLike>(context));

    const { states } = usecasesToStates({ usecasesArr, store });
    const { evts } = usecasesToEvts({ usecasesArr, store, rootContext: context });
    const { functions } = usecasesToFunctions({ usecasesArr, store });

    const evtStateUpdated = store.evtAction.pipe(() => [id<void>(undefined)]);

    evtStateUpdated.setMaxHandlers(Infinity);

    const core: GenericCore<Usecases, Context> = {
        evtStateUpdated,
        states,
        evts,
        functions,
        types: null as any
    };

    //@ts-expect-error
    delete core.types;

    return {
        core,
        "dispatch": store.dispatch,
        "getState": store.getState,
        "evtAction": store.evtAction
    };
}
