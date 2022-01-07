import type { Action, ThunkAction as GenericThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import type { Port1 } from "./ports/Port1";
import type { Port2 } from "./ports/Port2";
import { createPort2 } from "./secondaryAdapters/createProt2";
import type { Port2Config } from "./secondaryAdapters/createProt2";
import { createPort1 } from "./secondaryAdapters/createPort1";
import type { Port1Config } from "./secondaryAdapters/createPort1";
import type { ReturnType } from "tsafe";
import { reducer, createMiddlewareEvtAction } from "./usecases";

export type CreateStoreParams = {
    port1Config: Port1Config;
    port2Config: Port2Config;
};

export type ThunksExtraArgument = {
    createStoreParams: CreateStoreParams;
    port1: Port1;
    port2: Port2;
    evtAction: ReturnType<typeof createMiddlewareEvtAction>["evtAction"];
};

export async function createStore(params: CreateStoreParams) {
    const [port1, port2] = await Promise.all([
        createPort1(params.port1Config),
        createPort2(params.port2Config),
    ]);

    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction();

    const store = configureStore({
        reducer,
        "middleware": getDefaultMiddleware => [
            ...getDefaultMiddleware({
                "thunk": {
                    "extraArgument": id<ThunksExtraArgument>({
                        "createStoreParams": params,
                        port1,
                        port2,
                        evtAction
                    }),
                },
            }),
            middlewareEvtAction
        ] as const
    });

    //await store.dispatch(usecase2.privateThunks.initialize());

    return store;
}

type Store = ReturnType<typeof createStore>;

export type Dispatch = Store["dispatch"];

export type State = ReturnType<Store["getState"]>;

export type ThunkAction<RtnType = Promise<void>> = GenericThunkAction<
    RtnType,
    State,
    ThunksExtraArgument,
    Action<string>
>;
