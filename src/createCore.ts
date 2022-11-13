import type {
    ConfigureStoreOptions,
    EnhancedStore,
    MiddlewareArray,
    ThunkMiddleware,
    AnyAction,
    ReducersMapObject
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { usecasesToReducer } from "./usecasesToReducer";
import { createMiddlewareEvtAction } from "./middlewareEvtAction";
import type { UsecasesToReducer, UsecaseLike as UsecaseLike_reducer } from "./usecasesToReducer";
import type { UsecaseToEvent, UsecaseLike as UsecaseLike_evt } from "./middlewareEvtAction";
import type { NonPostableEvt } from "evt";

import type { ActionCreatorWithPayload, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

export type UsecaseLike = UsecaseLike_reducer & UsecaseLike_evt;

/** NOTE: We use an expended version of the UsecaseToEvent<> so that,
 * when the cursor hovers evtAction we get an explicit type instead of
 * a composition of union:
 * This: https://user-images.githubusercontent.com/6702424/147380322-bf2fa468-0a1c-4961-a7d8-16eaa14b6c4e.png
 * Instead of this: https://user-images.githubusercontent.com/6702424/147380353-9956a98a-9f9c-4811-a8b4-16cd1e4e76ca.png
 * Don't try, however, to edit the expanded from.
 * Uncomment the version of GenericCore using the factorized UsecaseToEvent and
 * work with that.
 */
export type GenericCore<
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>,
    Usecase extends UsecaseLike
> = {
    reducer: UsecasesToReducer<Usecase>;
    middleware: MiddlewareArray<
        [
            ThunkMiddleware<
                UsecasesToReducer<Usecase> extends ReducersMapObject<infer S, any> ? S : never,
                AnyAction,
                ThunksExtraArgumentWithoutEvtAction & {
                    evtAction: NonPostableEvt<UsecaseToEvent<Usecase>>;
                }
            >
        ]
    >;
} extends ConfigureStoreOptions<infer S, infer A, infer M>
    ? EnhancedStore<S, A, M> & {
          thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction & {
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
          };
      }
    : never;

/* NOTE: Do not remove, see above notice!
export type GenericCore<
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>,
    Usecase extends UsecaseLike
> = {
    reducer: UsecasesToReducer<Usecase>;
    middleware: MiddlewareArray<
        [
            ThunkMiddleware<
                UsecasesToReducer<Usecase> extends ReducersMapObject<infer S, any> ? S : never,
                AnyAction,
                ThunksExtraArgumentWithoutEvtAction & {
                    evtAction: NonPostableEvt<UsecaseToEvent<Usecase>>;
                }
            >
        ]
    >;
} extends ConfigureStoreOptions<infer S, infer A, infer M>
    ? EnhancedStore<S, A, M> & {
          thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction & {
              evtAction: NonPostableEvt<UsecaseToEvent<Usecase>>;
          };
      }
    : never;
*/

export function createCoreFromUsecases<
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>,
    Usecase extends UsecaseLike
>(params: {
    thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction;
    //usecases: readonly Usecase[];
    usecases: Record<string, Usecase>;
}): GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase> {
    const { thunksExtraArgument: thunksExtraArgumentWithoutEvtAction, usecases } = params;

    const usecasesArr = Object.values(usecases);

    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction(usecasesArr);

    const thunksExtraArgument = {
        ...thunksExtraArgumentWithoutEvtAction,
        evtAction
    };

    const { getState, dispatch } = configureStore({
        "reducer": usecasesToReducer(usecasesArr) as any,
        "middleware": getDefaultMiddleware =>
            getDefaultMiddleware({
                "thunk": { "extraArgument": thunksExtraArgument }
            }).concat(middlewareEvtAction)
    });

    const core = {
        getState,
        dispatch,
        thunksExtraArgument
    };

    return core as any;
}
