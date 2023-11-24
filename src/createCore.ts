import { Evt } from "evt";
import type { ReturnType } from "tsafe";
import { assert } from "tsafe/assert";

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

type UsecaseLike = UsecaseLike_store & UsecaseLike_evts & UsecaseLike_selectors & UsecaseLike_functions;

export type GenericCore<
    Usecases extends Record<string, UsecaseLike>,
    Context extends Record<string, unknown>
> = {
    states: CoreStates<Usecases[keyof Usecases]>;
    subscribe: (listener: () => void) => { unsubscribe: () => void };
    coreEvts: CoreEvts<Usecases[keyof Usecases]>;
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
} {
    const { context, usecases } = params;

    Object.entries(usecases).forEach(([key, usecase]) => {
        assert(
            key === usecase.name,
            `You should reconcile the name of the usecase (${usecase}) and the key it's assigned to in the usecases object (${key})`
        );
    });

    const usecasesArr = Object.values(usecases) as Usecases[keyof Usecases][];

    const store = createStore({ context, usecasesArr });

    const { states } = usecasesToStates({ usecasesArr, store });
    const { coreEvts } = usecasesToEvts({ usecasesArr, store });
    const { functions } = usecasesToFunctions({ usecasesArr, store });

    const core: GenericCore<Usecases, Context> = {
        "subscribe": listener => {
            const ctx = Evt.newCtx();

            store.evtAction.attach(ctx, () => listener());

            return {
                "unsubscribe": () => ctx.done()
            };
        },
        states,
        coreEvts,
        functions,
        types: null as any
    };

    //@ts-expect-error
    delete core.types;

    return {
        core,
        "dispatch": store.dispatch
    };
}
