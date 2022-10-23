import type { Action, ThunkAction as ReduxGenericThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import type { ReturnType } from "tsafe";
import type { Port1 } from "./ports/Port1";
import type { Port2 } from "./ports/Port2";
import { createPort2 } from "./adapters/createProt2";
import type { Port2Config } from "./adapters/createProt2";
import { createPort1 } from "./adapters/createPort1";
import type { Port1Config } from "./adapters/createPort1";
import { usecasesToReducer } from "redux-clean-architecture";
import type { GenericCreateEvt, GenericThunks } from "redux-clean-architecture";
//Delete this line if you're not going to use evtAction middleware...
import { createMiddlewareEvtActionFactory } from "redux-clean-architecture/middlewareEvtAction";
/*Naming suggestion: 
 * if you have usecases/explorer.ts
 * import it like:
 * import * as explorerUsecase from "./usecases/explorer";
 */
import * as usecase1 from "./usecases/usecase1";
import * as usecase2 from "./usecases/usecase2";
import * as usecase3 from "./usecases/usecase3";

export const usecases = [usecase1, usecase2, usecase3];

export type CreateStoreParams = {
    port1Config: Port1Config;
    port2Config: Port2Config;
};

//...and this line
const { createMiddlewareEvtAction } = createMiddlewareEvtActionFactory(usecases);

export type ThunksExtraArgument = {
    createStoreParams: CreateStoreParams;
    port1: Port1;
    port2: Port2;
    //...and this line
    evtAction: ReturnType<typeof createMiddlewareEvtAction>["evtAction"];
};

export async function createCore(params: CreateStoreParams) {
    const [port1, port2] = await Promise.all([
        createPort1(params.port1Config),
        createPort2(params.port2Config),
    ]);

    //...also this line
    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction();

    const  thunksExtraArgument: ThunksExtraArgument = {
        "createStoreParams": params,
        port1,
        port2,
        evtAction
    };

    const { getState, dispatch, subscribe } = configureStore({
        "reducer": usecasesToReducer(usecases),
        "middleware": getDefaultMiddleware =>
            getDefaultMiddleware({
                "thunk": { "extraArgument": thunksExtraArgument },
            })
                //...and finally this line
                .concat(middlewareEvtAction),
    });

    //await store.dispatch(usecase2.privateThunks.initialize());

    const core = { 
        getState, 
        dispatch, 
        subscribe,
        thunksExtraArgument 
    };

    return core;

}


export type Core = ReturnType<typeof createCore>;

export type State = ReturnType<Core["getState"]>;

/** @deprecated: Use Thunks as soon as we cas use 'satisfy' from TS 4.9 */
export type ThunkAction<RtnType = Promise<void>> = ReduxGenericThunkAction<
    RtnType,
    State,
    ThunksExtraArgument,
    Action<string>
>;

export type Thunks = GenericThunks<Core>;


export type CreateEvt = GenericCreateEvt<Core>;
