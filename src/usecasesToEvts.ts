import "minimal-polyfills/Object.fromEntries";
import { Polyfill as WeakMap } from "minimal-polyfills/WeakMap";
import { capitalize } from "tsafe/capitalize";
import type { NonPostableEvt } from "evt";

const wordId = "evt";

type CoreLike = {
    thunksExtraArgument: {
        evtAction: NonPostableEvt<any>;
    };
    getState: () => Record<string, unknown>;
};

export type GenericCreateEvtParam<Core extends CoreLike> = {
    evtAction: Core["thunksExtraArgument"]["evtAction"];
    getState: Core["getState"];
};

export function usecasesToEvts<
    Usecase extends {
        name: string;
        createEvt: (params: GenericCreateEvtParam<CoreLike>) => NonPostableEvt<any>;
    },
>(
    usecases: readonly Usecase[],
): {
    getMemoizedCoreEvts: (core: CoreLike) => {
        [Key in `${typeof wordId}${Capitalize<Usecase["name"]>}`]: ReturnType<
            Extract<
                Usecase,
                {
                    name: Key extends `${typeof wordId}${infer CapitalizedName}`
                        ? Uncapitalize<CapitalizedName>
                        : never;
                }
            >["createEvt"]
        >;
    };
} {
    const evtsByCore = new WeakMap<Record<string, unknown>, any>();

    return {
        "getMemoizedCoreEvts": core => {
            let evts = evtsByCore.get(core);

            if (evts !== undefined) {
                return evts;
            }

            const {
                getState,
                thunksExtraArgument: { evtAction },
            } = core;

            evts = Object.fromEntries(
                usecases.map(({ name, createEvt }) => [
                    `${wordId}${capitalize(name)}`,
                    createEvt({
                        evtAction,
                        getState,
                    }),
                ]),
            ) as any;

            evtsByCore.set(core, evts);

            return evts;
        },
    };
}
