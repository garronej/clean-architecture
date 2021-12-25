import type { NonPostableEvt } from "evt";
import type {
    Middleware,
    ActionCreator,
    ActionCreatorWithPayload,
    ActionCreatorWithoutPayload,
} from "@reduxjs/toolkit";
import { Evt } from "evt";
import { exclude } from "tsafe/exclude";
import { typeGuard } from "tsafe/typeGuard";
import { symToStr } from "tsafe/symToStr";

type CaseReducerToEvent<T extends Record<string, ActionCreator<any>>> = RecordToUnion<{
    [K in keyof T]: { actionName: K } & (T[K] extends ActionCreatorWithoutPayload<any>
        ? {}
        : {
              payload: T[K] extends ActionCreatorWithPayload<infer U> ? U : never;
          });
}>;

type RecordToUnion<O> = O[keyof O];

type UsecaseToEvent<
    Usecase extends { name: string } & (
        | { actions: Record<string, ActionCreator<any>> }
        | { reducer: null }
    ),
> = RecordToUnion<{
    [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
        Usecase,
        { name: Key; actions: unknown }
    >
        ? { sliceName: Key } & CaseReducerToEvent<Usecase["actions"]>
        : never;
}>;

export function createMiddlewareEvtActionFactory<
    Usecase extends { name: string } & (
        | { actions: Record<string, ActionCreator<any>> }
        | { reducer: null }
    ),
>(usecases: readonly Usecase[]) {
    function createMiddlewareEvtAction(): {
        evtAction: NonPostableEvt<UsecaseToEvent<Usecase>>;
        middlewareEvtAction: Middleware;
    } {
        const actionTypes = new Set(
            usecases
                .map(usecase =>
                    typeGuard<Extract<typeof usecase, { actions: unknown }>>(usecase, true)
                        ? usecase
                        : undefined,
                )
                .filter(exclude(undefined))
                .map(({ name, actions }) =>
                    Object.keys(actions).map(actionName => `${name}/${actionName}`),
                )
                .reduce((prev, curr) => [...prev, ...curr], []),
        );

        const evtAction = Evt.create<{
            sliceName: string;
            actionName: string;
        }>();

        const middlewareEvtAction: Middleware = () => next => (action: { type: string }) => {
            if (!actionTypes.has(action.type)) {
                console.warn(
                    [
                        `Unknown action type ${action.type}.`,
                        `${symToStr({ middlewareEvtAction })} is misconfigured`,
                    ].join(" "),
                );
                return next(action);
            }

            const [sliceName, ...rest] = action.type.split("/");

            const out = next(action);

            evtAction.post({
                "sliceName": sliceName,
                "actionName": rest.join("/"),
            });

            return out;
        };

        return { "evtAction": evtAction as any, middlewareEvtAction };
    }

    return { createMiddlewareEvtAction };
}
