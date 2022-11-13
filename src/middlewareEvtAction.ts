import type { NonPostableEvt } from "evt";
import type {
    Middleware,
    ActionCreator,
    ActionCreatorWithPayload,
    ActionCreatorWithoutPayload
} from "@reduxjs/toolkit";
import { Evt } from "evt";
import { exclude } from "tsafe/exclude";
import { typeGuard } from "tsafe/typeGuard";
import { symToStr } from "tsafe/symToStr";

export type UsecaseLike = { name: string } & (
    | { actions: Record<string, ActionCreator<any>> }
    | { reducer: null; actions?: undefined }
);

type RecordToUnion<O> = O[keyof O];

type CaseReducerToEvent<T extends Record<string, ActionCreator<any>>> = RecordToUnion<{
    [K in keyof T]: { actionName: K } & (T[K] extends ActionCreatorWithoutPayload<any>
        ? {}
        : {
              payload: T[K] extends ActionCreatorWithPayload<infer U> ? U : never;
          });
}>;

export type UsecaseToEvent<Usecase extends UsecaseLike> = RecordToUnion<{
    [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
        Usecase,
        { name: Key; actions: unknown }
    >
        ? { sliceName: Key } & CaseReducerToEvent<Usecase["actions"]>
        : never;
}>;

/* NOTE: Do not remove! See ./createCore.ts
export type UsecaseToEvent<Usecase extends UsecaseLike> = {
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
                        payload: Usecase["actions"][K] extends ActionCreatorWithPayload<infer U>
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
                        payload: Usecase["actions"][K] extends ActionCreatorWithPayload<infer U>
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
                        payload: Usecase["actions"][K] extends ActionCreatorWithPayload<infer U>
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
                        payload: Usecase["actions"][K] extends ActionCreatorWithPayload<infer U>
                            ? U
                            : never;
                    };
          }]
        : never;
}];
*/

export function createMiddlewareEvtAction<Usecase extends UsecaseLike>(
    usecasesArr: readonly Usecase[]
): {
    evtAction: NonPostableEvt<UsecaseToEvent<Usecase>>;
    middlewareEvtAction: Middleware;
} {
    const actionTypes = new Set(
        usecasesArr
            .map(usecase =>
                typeGuard<Extract<typeof usecase, { actions: unknown }>>(
                    usecase,
                    "reducer" in usecase && usecase.reducer !== null
                )
                    ? usecase
                    : undefined
            )
            .filter(exclude(undefined))
            .map(({ name, actions }) => Object.keys(actions).map(actionName => `${name}/${actionName}`))
            .reduce((prev, curr) => [...prev, ...curr], [])
    );

    const evtAction = Evt.create<{
        sliceName: string;
        actionName: string;
        lifecycleStage?: string;
        payload: any;
    }>();

    const middlewareEvtAction: Middleware = () => next => (action: { type: string; payload: any }) => {
        if (
            !actionTypes.has(action.type) &&
            !["pending", "rejected", "fulfilled"].find(lifecycleStage =>
                action.type.endsWith(`/${lifecycleStage}`)
            )
        ) {
            console.warn(
                [
                    `Unknown action type ${action.type}.`,
                    `${symToStr({ middlewareEvtAction })} is misconfigured`
                ].join(" ")
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
                      "lifecycleStage": lifecycleStage.join("/")
                  }),
            "payload": action.payload
        });

        return out;
    };

    return { "evtAction": evtAction as any, middlewareEvtAction };
}
