import { Evt } from "evt";
import type { NonPostableEvt } from "evt";
import { id } from "tsafe/id";
import type { ReturnType } from "tsafe";

import { createStore, type GenericStore, type UsecaseLike as UsecaseLike_store } from "./createStore";

import {
    usecasesToEvts,
    type CoreEvts,
    type GenericCreateEvt,
    type UsecaseLike as UsecaseLike_evts
} from "./usecasesToEvts";
import {
    usecasesToSelectors,
    type GenericSelectors,
    type UsecaseLike as UsecaseLike_selectors
} from "./usecasesToSelectors";
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
    getState: GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>["getState"];
    selectors: GenericSelectors<Usecase>;
    evtStateUpdated: NonPostableEvt<void>;
    coreEvts: CoreEvts<Usecase>;
    functions: CoreFunctions<Usecase>;
    ["~internal"]: {
        ofTypeState: ReturnType<GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>["getState"]>;
        ofTypeCreateEvt: GenericCreateEvt<GenericStore<ThunksExtraArgumentWithoutEvtAction, Usecase>>;
        ofTypeThunks: Record<
            string,
            (
                params: any
            ) => ThunkAction<
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

export function createCore<
    Usecase extends UsecaseLike,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
>(params: {
    thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction;
    usecases: Record<string, Usecase>;
}): GenericCore<Usecase, ThunksExtraArgumentWithoutEvtAction> {
    const { thunksExtraArgument, usecases } = params;

    const store = createStore({ thunksExtraArgument, usecases });

    const usecasesArr = Object.values(usecases);

    const selectors = usecasesToSelectors({ usecasesArr });
    const { coreEvts } = usecasesToEvts({ usecasesArr, store });
    const { functions } = usecasesToFunctions({ usecasesArr, store });

    return {
        "getState": store.getState,
        "evtStateUpdated": Evt.asNonPostable(store.evtAction.pipe(() => [id<void>(undefined)])),
        selectors,
        coreEvts,
        functions,
        "evtAction": store.evtAction,
        //@ts-expect-error
        "~internal": null
    };
}

export type Scaffolding<
    Setup extends (params: any) => Promise<{
        core: {
            ["~internal"]: {
                ofTypeState: any;
                ofTypeCreateEvt: any;
                ofTypeThunks: any;
            };
        };
    }>
> = {
    State: ReturnType<Setup>["core"]["~internal"]["ofTypeState"];
    Thunks: ReturnType<Setup>["core"]["~internal"]["ofTypeThunks"];
    CreateEvt: ReturnType<Setup>["core"]["~internal"]["ofTypeCreateEvt"];
};
