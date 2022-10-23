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

/*
type RecordToUnion<O> = O[keyof O];

type CaseReducerToEvent<T extends Record<string, ActionCreator<any>>> = RecordToUnion<{
    [K in keyof T]: { actionName: K } & (T[K] extends ActionCreatorWithoutPayload<any>
        ? {}
        : {
              payload: T[K] extends ActionCreatorWithPayload<infer U> ? U : never;
          });
}>;

type UsecaseToEvent<
    Usecase extends { name: string } & (
        | { actions: Record<string, ActionCreator<any>> }
        | { reducer: null; actions?: undefined; }
    ),
> = RecordToUnion<{
    [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
        Usecase,
        { name: Key; actions: unknown }
    >
        ? { sliceName: Key } & CaseReducerToEvent<Usecase["actions"]>
        : never;
}>;
*/

export function createMiddlewareEvtActionFactory<
    Usecase extends { name: string } & (
        | { actions: Record<string, ActionCreator<any>> }
        | { reducer: null; actions?: undefined }
    ),
>(usecases: readonly Usecase[]) {
    function createMiddlewareEvtAction(): {
        /** NOTE: We use an expended version of the type so that,
         * when the cursor hovers evtAction we get an explicit type instead of
         * a composition of union:
         * This: https://user-images.githubusercontent.com/6702424/147380322-bf2fa468-0a1c-4961-a7d8-16eaa14b6c4e.png
         * Instead of this: https://user-images.githubusercontent.com/6702424/147380353-9956a98a-9f9c-4811-a8b4-16cd1e4e76ca.png
         * Don't try, however, to edit the expanded version. Start from the factorized
         * form by uncommenting the following line and the helper types it leverages.
         */
        //evtAction: NonPostableEvt<UsecaseToEvent<Usecase>>;
        evtAction: NonPostableEvt<
            {
                [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
                    Usecase,
                    { name: Key; actions: unknown }
                >
                    ? {
                          [K in keyof Usecase["actions"]]: Usecase["actions"][K] extends ActionCreatorWithoutPayload<any>
                              ? {
                                    sliceName: Key;
                                    actionName: K;
                                }
                              : {
                                    sliceName: Key;
                                    actionName: K;
                                    payload: Usecase["actions"][K] extends ActionCreatorWithPayload<
                                        infer U
                                    >
                                        ? U
                                        : never;
                                };
                      }[keyof {
                          [K in keyof Usecase["actions"]]: Usecase["actions"][K] extends ActionCreatorWithoutPayload<any>
                              ? {
                                    sliceName: Key;
                                    actionName: K;
                                }
                              : {
                                    sliceName: Key;
                                    actionName: K;
                                    payload: Usecase["actions"][K] extends ActionCreatorWithPayload<
                                        infer U
                                    >
                                        ? U
                                        : never;
                                };
                      }]
                    : never;
            }[keyof {
                [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
                    Usecase,
                    { name: Key; actions: unknown }
                >
                    ? {
                          [K in keyof Usecase["actions"]]: Usecase["actions"][K] extends ActionCreatorWithoutPayload<any>
                              ? {
                                    sliceName: Key;
                                    actionName: K;
                                }
                              : {
                                    sliceName: Key;
                                    actionName: K;
                                    payload: Usecase["actions"][K] extends ActionCreatorWithPayload<
                                        infer U
                                    >
                                        ? U
                                        : never;
                                };
                      }[keyof {
                          [K in keyof Usecase["actions"]]: Usecase["actions"][K] extends ActionCreatorWithoutPayload<any>
                              ? {
                                    sliceName: Key;
                                    actionName: K;
                                }
                              : {
                                    sliceName: Key;
                                    actionName: K;
                                    payload: Usecase["actions"][K] extends ActionCreatorWithPayload<
                                        infer U
                                    >
                                        ? U
                                        : never;
                                };
                      }]
                    : never;
            }]
        >;
        middlewareEvtAction: Middleware;
    } {
        const actionTypes = new Set(
            usecases
                .map(usecase =>
                    typeGuard<Extract<typeof usecase, { actions: unknown }>>(
                        usecase,
                        "reducer" in usecase && usecase.reducer !== null,
                    )
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
            lifecycleStage?: string;
            payload: any;
        }>();

        const middlewareEvtAction: Middleware =
            () => next => (action: { type: string; payload: any }) => {
                if (
                    !actionTypes.has(action.type) &&
                    !["pending", "rejected", "fulfilled"].find(lifecycleStage =>
                        action.type.endsWith(`/${lifecycleStage}`),
                    )
                ) {
                    console.warn(
                        [
                            `Unknown action type ${action.type}.`,
                            `${symToStr({ middlewareEvtAction })} is misconfigured`,
                        ].join(" "),
                    );

                    return next(action);
                }

                const [sliceName, actionName, ...lifecycleStage] = action.type.split("/");

                const out = next(action);

                evtAction.post({
                    sliceName,
                    actionName,
                    ...(lifecycleStage.length === 0
                        ? {}
                        : {
                              "lifecycleStage": lifecycleStage.join("/"),
                          }),
                    "payload": action.payload,
                });

                return out;
            };

        return { "evtAction": evtAction as any, middlewareEvtAction };
    }

    return { createMiddlewareEvtAction };
}
