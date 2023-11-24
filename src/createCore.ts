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
    Usecase extends UsecaseLike,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
> = {
    states: CoreStates<Usecase>;
    subscribe: (listener: () => void) => { unsubscribe: () => void };
    coreEvts: CoreEvts<Usecase>;
    functions: CoreFunctions<Usecase>;
    types: {
        State: ReturnType<GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>["getState"]>;
        CreateEvt: GenericCreateEvt<GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>>;
        Thunks: Record<
            string,
            (params: any) => ThunkAction<
                any,
                ReturnType<GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>["getState"]>,
                ThunksExtraArgumentWithoutEvtAction & {
                    evtAction: GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>["evtAction"];
                },
                Action<string>
            >
        >;
    };
};

export type MyCore<
    Usecases extends Record<string, UsecaseLike>,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
> = GenericCore<Usecases[keyof Usecases], ThunksExtraArgumentWithoutEvtAction>;

export function createCore<
    Usecase extends UsecaseLike,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
>(params: {
    thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction;
    usecases: Record<string, Usecase>;
}): {
    core: GenericCore<Usecase, ThunksExtraArgumentWithoutEvtAction>;
    dispatch: GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>["dispatch"];
} {
    const { thunksExtraArgument, usecases } = params;

    Object.entries(usecases).forEach(([key, usecase]) => {
        assert(
            key === usecase.name,
            `You should reconcile the name of the usecase (${usecase}) and the key it's assigned to in the usecases object (${key})`
        );
    });

    const usecasesArr = Object.values(usecases);

    const store = createStore({ thunksExtraArgument, usecasesArr });

    const { states } = usecasesToStates({ usecasesArr, store });
    const { coreEvts } = usecasesToEvts({ usecasesArr, store });
    const { functions } = usecasesToFunctions({ usecasesArr, store });

    const core: GenericCore<Usecase, ThunksExtraArgumentWithoutEvtAction> = {
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
