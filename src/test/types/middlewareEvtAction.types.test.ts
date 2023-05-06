import { Reflect } from "tsafe/Reflect";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { NonPostableEvt } from "evt";
import { createMiddlewareEvtAction } from "../../middlewareEvtAction";
import type { UnpackEvt } from "evt";
import type {
    Middleware,
    ActionCreatorWithPayload,
    ActionCreatorWithoutPayload
} from "@reduxjs/toolkit";

const usecasesArr = Reflect<
    (
        | {
              name: "myFirstSlice";
              actions: {
                  foo: ActionCreatorWithPayload<{ delta: number }>;
                  bar: ActionCreatorWithoutPayload<any>;
                  baz: ActionCreatorWithPayload<{ beta: string }>;
              };
          }
        | {
              name: "mySecondSlice";
              actions: {
                  foo1: ActionCreatorWithPayload<{ delta1: number }>;
                  bar1: ActionCreatorWithoutPayload<any>;
                  baz1: ActionCreatorWithPayload<{ beta1: string }>;
              };
          }
        | { name: "myThirdSlice"; reducer: null }
    )[]
>();

const got = createMiddlewareEvtAction(usecasesArr);

const expected = Reflect<{
    evtAction: NonPostableEvt<
        | {
              sliceName: "myFirstSlice";
              actionName: "foo";
              payload: { delta: number };
          }
        | {
              sliceName: "myFirstSlice";
              actionName: "bar";
          }
        | {
              sliceName: "myFirstSlice";
              actionName: "baz";
              payload: { beta: string };
          }
        | {
              sliceName: "mySecondSlice";
              actionName: "foo1";
              payload: { delta1: number };
          }
        | {
              sliceName: "mySecondSlice";
              actionName: "bar1";
          }
        | {
              sliceName: "mySecondSlice";
              actionName: "baz1";
              payload: { beta1: string };
          }
    >;
    middlewareEvtAction: Middleware;
}>();

//NOTE: We can compare got and expected directly because we can't unite recursively in Equals.
//assert<Equals<typeof got, typeof expected>>();
assert<Equals<(typeof got)["middlewareEvtAction"], (typeof expected)["middlewareEvtAction"]>>();
assert<Equals<UnpackEvt<(typeof got)["evtAction"]>, UnpackEvt<(typeof expected)["evtAction"]>>>();
