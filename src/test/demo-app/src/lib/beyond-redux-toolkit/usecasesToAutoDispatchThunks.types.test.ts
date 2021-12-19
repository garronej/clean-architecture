/* eslint-disable no-lone-blocks */
import type { ThunkAction } from "@reduxjs/toolkit";
import { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import type {
    ThunkToAutoDispatchThunk,
    ThunksToAutoDispatchThunks,
} from "./usecasesToAutoDispatchThunks";
import {
    thunkToAutoDispatchThunk,
    thunksToAutoDispatchThunks,
    usecasesToAutoDispatchThunks,
} from "./usecasesToAutoDispatchThunks";
import type { AnyAction } from "@reduxjs/toolkit";

{
    type Params = {
        _brandParams: unknown;
    };

    type R = {
        _brandReturn: unknown;
    };

    type Thunk = (params: Params) => ThunkAction<R, any, any, any>;

    type Got = ThunkToAutoDispatchThunk<Thunk>;

    type Expected = (params: Params) => R;

    assert<Equals<Got, Expected>>();
}

{
    type Params = {
        _brandParams: unknown;
    };

    type RtnType = {
        _brandReturn: unknown;
    };

    type State = {
        _brandState: unknown;
    };

    type ExtraThunkArg = {
        _brandExtraThunkArg: unknown;
    };

    const thunk = Reflect<(params: Params) => ThunkAction<RtnType, State, ExtraThunkArg, AnyAction>>();

    //const dispatch = Reflect<(thunkAction: ThunkAction<any, State, ExtraThunkArg, AnyAction>)=>any>();
    const dispatch = Reflect<<R>(thunkAction: ThunkAction<R, State, ExtraThunkArg, AnyAction>) => R>();

    const got = thunkToAutoDispatchThunk({
        dispatch,
        thunk,
    });

    const expected = Reflect<(params: Params) => RtnType>();

    assert<Equals<typeof got, typeof expected>>();
}

{
    type Params1 = {
        _brandParams1: unknown;
    };

    type Params2 = {
        _brandParams2: unknown;
    };

    type RtnType1 = {
        _brandReturn1: unknown;
    };

    type RtnType2 = {
        _brandReturn2: unknown;
    };

    type State = {
        _brandState: unknown;
    };

    type ExtraThunkArg = {
        _brandExtraThunkArg: unknown;
    };

    type Thunks = {
        myFirstThunk: (params: Params1) => ThunkAction<RtnType1, State, ExtraThunkArg, AnyAction>;
        mySecondThunk: (params: Params2) => ThunkAction<RtnType2, State, ExtraThunkArg, AnyAction>;
    };

    type Got = ThunksToAutoDispatchThunks<Thunks>;

    type Expected = {
        myFirstThunk: (params: Params1) => RtnType1;
        mySecondThunk: (params: Params2) => RtnType2;
    };

    assert<Equals<Got, Expected>>();
}

{
    type Params1 = {
        _brandParams1: unknown;
    };

    type Params2 = {
        _brandParams2: unknown;
    };

    type RtnType1 = {
        _brandReturn1: unknown;
    };

    type RtnType2 = {
        _brandReturn2: unknown;
    };

    type State = {
        _brandState: unknown;
    };

    type ExtraThunkArg = {
        _brandExtraThunkArg: unknown;
    };

    const thunks = Reflect<{
        myFirstThunk: (params: Params1) => ThunkAction<RtnType1, State, ExtraThunkArg, AnyAction>;
        mySecondThunk: (params: Params2) => ThunkAction<RtnType2, State, ExtraThunkArg, AnyAction>;
    }>();

    const dispatch =
        Reflect<
            <RtnType>(thunkAction: ThunkAction<RtnType, State, ExtraThunkArg, AnyAction>) => RtnType
        >();

    const got = thunksToAutoDispatchThunks({
        dispatch,
        thunks,
    });

    const expected = Reflect<{
        myFirstThunk: (params: Params1) => RtnType1;
        mySecondThunk: (params: Params2) => RtnType2;
    }>();

    assert<Equals<typeof got, typeof expected>>();
}

{
    type Params1 = {
        _brandParams1: unknown;
    };

    type Params2 = {
        _brandParams2: unknown;
    };

    type Params3 = {
        _brandParams3: unknown;
    };

    type RtnType1 = {
        _brandReturn1: unknown;
    };

    type RtnType2 = {
        _brandReturn2: unknown;
    };

    type RtnType3 = {
        _brandReturn2: unknown;
    };

    type State = {
        _brandState: unknown;
    };

    type ExtraThunkArg = {
        _brandExtraThunkArg: unknown;
    };

    const usecases = Reflect<
        [
            {
                name: "firstSlice";
                thunks: {
                    firstMethod: (
                        params: Params1,
                    ) => ThunkAction<RtnType1, State, ExtraThunkArg, AnyAction>;
                    secondMethod: (
                        params: Params2,
                    ) => ThunkAction<RtnType2, State, ExtraThunkArg, AnyAction>;
                };
            },
            {
                name: "secondSlice";
                thunks: {
                    thirdMethod: (params: Params3) => ThunkAction<RtnType3, any, any, any>;
                };
            },
        ]
    >();

    const dispatch = Reflect<<R>(thunkAction: ThunkAction<R, any, any, any>) => R>();

    const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(usecases);

    const got = getAutoDispatchThunks(dispatch);

    const expected = Reflect<{
        firstSliceThunks: {
            firstMethod: (params: Params1) => RtnType1;
            secondMethod: (params: Params2) => RtnType2;
        };
        secondSliceThunks: {
            thirdMethod: (params: Params3) => RtnType3;
        };
    }>();

    assert<Equals<typeof got, typeof expected>>();
}
