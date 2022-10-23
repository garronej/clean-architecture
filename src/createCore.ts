import type {
    ConfigureStoreOptions,
    EnhancedStore,
    MiddlewareArray,
    ThunkMiddleware,
    AnyAction,
    ReducersMapObject,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { usecasesToReducer } from "./usecasesToReducer";
import { createMiddlewareEvtAction } from "./middlewareEvtAction";
import type { UsecasesToReducer, UsecaseLike as UsecaseLike_reducer } from "./usecasesToReducer";
import type { UsecaseToEvent, UsecaseLike as UsecaseLike_evt } from "./middlewareEvtAction";
import type { NonPostableEvt } from "evt";

export type UsecaseLike = UsecaseLike_reducer & UsecaseLike_evt;

export type GenericCore<
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>,
    Usecase extends UsecaseLike,
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
            >,
        ]
    >;
} extends ConfigureStoreOptions<infer S, infer A, infer M>
    ? EnhancedStore<S, A, M> & {
          thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction & {
              evtAction: NonPostableEvt<UsecaseToEvent<Usecase>>;
          };
      }
    : never;

export function createCore<
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>,
    Usecase extends UsecaseLike,
>(params: {
    thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction;
    usecases: readonly Usecase[];
}): GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase> {
    const { thunksExtraArgument: thunksExtraArgumentWithoutEvtAction, usecases } = params;

    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction(usecases as any);

    const thunksExtraArgument = {
        ...thunksExtraArgumentWithoutEvtAction,
        evtAction,
    };

    const { getState, dispatch, subscribe } = configureStore({
        "reducer": usecasesToReducer(usecases) as any,
        "middleware": getDefaultMiddleware =>
            getDefaultMiddleware({
                "thunk": { "extraArgument": thunksExtraArgument },
            }).concat(middlewareEvtAction),
    });

    const core = {
        getState,
        dispatch,
        subscribe,
        thunksExtraArgument,
    };

    return core as any;
}
