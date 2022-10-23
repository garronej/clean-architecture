import { createCoreFromUsecases } from "../../createCore";
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
    type ThunksExtraArgumentWithoutEvtAction = {
        _brandThunksExtraArgument: unknown;
    };

    const usecases = [
        {
            "name": "myFirstSlice",
            "reducer": Reflect<Reducer<{ foo: string }>>(),

            "actions": Reflect<{
                foo: ActionCreatorWithPayload<{ delta: number }>;
                bar: ActionCreatorWithoutPayload<any>;
                baz: ActionCreatorWithPayload<{ beta: string }>;
            }>()
        },
        {
            "name": "mySecondSlice",
            "reducer": Reflect<Reducer<{ bar: string }>>(),

            "actions": Reflect<{
                foo1: ActionCreatorWithPayload<{ delta1: number }>;
                bar1: ActionCreatorWithoutPayload<any>;
                baz1: ActionCreatorWithPayload<{ beta1: string }>;
            }>()
        },
        { "name": "myThirdSlice", "reducer": null }
    ] as const;

    const core = createCoreFromUsecases({
        "thunksExtraArgument": Reflect<ThunksExtraArgumentWithoutEvtAction>(),
        usecases
    });

    type Got = typeof core;

    //type Dispatch = Got["dispatch"]

    type StateExpected = {
        myFirstSlice: { foo: string };
        mySecondSlice: { bar: string };
    };

    type ExpectedThunksExtraArgument = ThunksExtraArgumentWithoutEvtAction & {
        evtAction: NonPostableEvt<UsecaseToEvent<typeof usecases[number]>>;
    };

    type Expected = {
        getState: () => StateExpected;
        dispatch: ThunkDispatch<StateExpected, ExpectedThunksExtraArgument, AnyAction> &
            Dispatch<Action<any>>;
        thunksExtraArgument: ExpectedThunksExtraArgument;
    };

    assert<Equals<Got["getState"], Expected["getState"]>>();
    assert<Equals<Got["thunksExtraArgument"], Expected["thunksExtraArgument"]>>();
    assert<Equals<Got["dispatch"], Expected["dispatch"]>>();
}
