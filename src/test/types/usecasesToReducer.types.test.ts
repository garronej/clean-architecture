import { usecasesToReducer } from "../../usecasesToReducer";
import type { Reducer } from "@reduxjs/toolkit";
import { Reflect } from "tsafe/Reflect";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

const usecasesArr = [
    { "name": "myFirstUsecase", "reducer": Reflect<Reducer<{ foo: string }>>() },
    { "name": "mySecondUsecase", "reducer": Reflect<Reducer<{ bar: string }>>() },
    { "name": "myThirdSlice", "reducer": null }
] as const;

const reducer = usecasesToReducer(usecasesArr);

type ExpectedReducer = {
    myFirstUsecase: Reducer<{ foo: string }>;
    mySecondUsecase: Reducer<{ bar: string }>;
};

assert<Equals<typeof reducer, ExpectedReducer>>();
