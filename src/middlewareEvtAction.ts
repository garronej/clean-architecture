import type { NonPostableEvt } from "evt";
import type { Middleware } from "@reduxjs/toolkit";
import { Evt } from "evt";
import { exclude } from "tsafe/exclude";
import { typeGuard } from "tsafe/typeGuard";
import { symToStr } from "tsafe/symToStr";

export function createMiddlewareEvtActionFactory<
    Usecase extends { name: string } & ({ actions: Record<string, unknown> } | { reducer: null }),
>(usecases: readonly Usecase[]) {
    /*
	type UsecaseToEventData<
		Usecase extends { name: string } & ({ actions: Record<string, unknown> } | { reducer: null }),
	> = RecordToEventData<{
		[Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
			Usecase,
			{ name: Key; actions: unknown }
		>
			? keyof Usecase["actions"]
			: never;
	}>;

	type RecordToEventData<O> = {
		[P in keyof O]: { sliceName: P; actionName: O[P] };
	}[keyof O];
	*/

    function createMiddlewareEvtAction(): {
        evtAction: NonPostableEvt<
            {
                [P in keyof {
                    [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
                        Usecase,
                        { name: Key; actions: unknown }
                    >
                        ? keyof Usecase["actions"]
                        : never;
                }]: {
                    sliceName: P;
                    actionName: {
                        [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
                            Usecase,
                            { name: Key; actions: unknown }
                        >
                            ? keyof Usecase["actions"]
                            : never;
                    }[P];
                };
            }[keyof {
                [Key in Extract<Usecase, { actions: unknown }>["name"]]: Usecase extends Extract<
                    Usecase,
                    { name: Key; actions: unknown }
                >
                    ? keyof Usecase["actions"]
                    : never;
            }]
        >;
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
                console.warn([
                    `Unknown action type ${action.type}.`,
                    `${symToStr({ middlewareEvtAction })} is misconfigured`,
                ]);
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
