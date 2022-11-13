import { usecasesToReducer } from "../../usecasesToReducer";
import type { Reducer } from "@reduxjs/toolkit";
import { Reflect } from "tsafe/Reflect";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

const usecasesArr = [
    { "name": "myFirstSlice", "reducer": Reflect<Reducer<{ foo: string }>>() },
    { "name": "mySecondSlice", "reducer": Reflect<Reducer<{ bar: string }>>() },
    { "name": "myThirdSlice", "reducer": null }
] as const;

const reducer = usecasesToReducer(usecasesArr);

type ExpectedReducer = {
    myFirstSlice: Reducer<{ foo: string }>;
    mySecondSlice: Reducer<{ bar: string }>;
};

assert<Equals<typeof reducer, ExpectedReducer>>();
