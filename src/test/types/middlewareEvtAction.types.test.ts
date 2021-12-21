import { Reflect } from "tsafe/Reflect";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { NonPostableEvt } from "evt";
import type { Middleware } from "@reduxjs/toolkit";
import { createMiddlewareEvtActionFactory } from "../../middlewareEvtAction";

const usecases =
    Reflect<
        (
            | { name: "myFirstSlice"; actions: Record<"foo" | "bar", unknown> }
            | { name: "mySecondSlice"; actions: Record<"baz", unknown>; reducer: unknown }
            | { name: "myThirdSlice"; reducer: null }
        )[]
    >();

const { createMiddlewareEvtAction } = createMiddlewareEvtActionFactory(usecases);

const got = createMiddlewareEvtAction();

const expected = Reflect<{
    evtAction: NonPostableEvt<
        | {
              sliceName: "myFirstSlice";
              actionName: "foo" | "bar";
          }
        | {
              sliceName: "mySecondSlice";
              actionName: "baz";
          }
    >;
    middlewareEvtAction: Middleware;
}>();

assert<Equals<typeof got, typeof expected>>();
