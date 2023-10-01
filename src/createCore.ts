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
import { assert } from "tsafe/assert";

export type UsecaseLike = UsecaseLike_reducer & UsecaseLike_evt;

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

export function createCoreFromUsecases<
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>,
    Usecase extends UsecaseLike
>(params: {
    thunksExtraArgument: ThunksExtraArgumentWithoutEvtAction;
    //usecases: readonly Usecase[];
    usecases: Record<string, Usecase>;
}): GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase> {
    const { thunksExtraArgument, usecases } = params;

    Object.entries(usecases).forEach(([key, usecase]) => {
        assert(
            key === usecase.name,
            `You should reconcile the name of the usecase (${usecase}) and the key it's assigned to in the usecases object (${key})`
        );
    });

    const usecasesArr = Object.values(usecases);

    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction(usecasesArr);

    //NOTE: We want to let the user change the properties, sometimes all the port
    //can't be ready at inception.
    Object.assign(thunksExtraArgument, { evtAction });

    const store = configureStore({
        "reducer": usecasesToReducer(usecasesArr) as any,
        "middleware": getDefaultMiddleware =>
            getDefaultMiddleware({
                "thunk": { "extraArgument": thunksExtraArgument },
                "serializableCheck": false
            }).concat(middlewareEvtAction)
    });

    const { getState, dispatch } = store;

    const core = {
        getState,
        dispatch,
        thunksExtraArgument,
        //NOTE: The redux store as a hidden property, just if you really need it
        store
    };

    return core as any;
}
