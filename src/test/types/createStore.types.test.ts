import { createStore } from "../../createStore";
import { Reflect } from "tsafe/Reflect";
import type {
    Reducer,
    ThunkDispatch,
    AnyAction,
    Dispatch,
    Action,
    ActionCreatorWithPayload,
    ActionCreatorWithoutPayload
} from "@reduxjs/toolkit";
import type { NonPostableEvt } from "evt";
import { UsecaseToEvent } from "../../middlewareEvtAction";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

{
    type Context = {
        _brandContext: unknown;
    };

    const usecases = {
        "myFirst": {
            "name": "myFirstUsecase" as const,
            "reducer": Reflect<Reducer<{ foo: string }>>(),

            "actions": Reflect<{
                foo: ActionCreatorWithPayload<{ delta: number }>;
                bar: ActionCreatorWithoutPayload<any>;
                baz: ActionCreatorWithPayload<{ beta: string }>;
            }>()
        },
        "mySecond": {
            "name": "mySecondUsecase" as const,
            "reducer": Reflect<Reducer<{ bar: string }>>(),

            "actions": Reflect<{
                foo1: ActionCreatorWithPayload<{ delta1: number }>;
                bar1: ActionCreatorWithoutPayload<any>;
                baz1: ActionCreatorWithPayload<{ beta1: string }>;
            }>()
        },
        "myThird": { "name": "myThirdSlice" as const, "reducer": null }
    };

    const usecasesArr = Object.values(usecases);

    const store = createStore({
        "context": Reflect<Context>(),
        usecasesArr
    });

    type Got = typeof store;

    //type Dispatch = Got["dispatch"]

    type StateExpected = {
        myFirstUsecase: { foo: string };
        mySecondUsecase: { bar: string };
    };

    type ExpectedThunksExtraArgument = Context & {
        evtAction: NonPostableEvt<UsecaseToEvent<(typeof usecasesArr)[number]>>;
    };

    type Expected = {
        getState: () => StateExpected;
        dispatch: ThunkDispatch<StateExpected, ExpectedThunksExtraArgument, AnyAction> &
            Dispatch<Action<any>>;
        evtAction: ExpectedThunksExtraArgument["evtAction"];
    };

    assert<Equals<Got, Expected>>();
}
