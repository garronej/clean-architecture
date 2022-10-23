import "minimal-polyfills/Object.fromEntries";
import { Polyfill as WeakMap } from "minimal-polyfills/WeakMap";
import { capitalize } from "tsafe/capitalize";
import type { NonPostableEvt } from "evt";
import { exclude } from "tsafe/exclude";

const wordId = "evt";

type CoreLike = {
    thunksExtraArgument: {
        evtAction: NonPostableEvt<any>;
    };
    //getState: () => Record<string, unknown>;
    getState: () => any;
};

export type GenericCreateEvt<Core extends CoreLike> = (params: {
    evtAction: Core["thunksExtraArgument"]["evtAction"];
    getState: Core["getState"];
}) => NonPostableEvt<any>;

export type UsecaseLike = {
    name: string;
    createEvt?: GenericCreateEvt<CoreLike>;
};

export type GetMemoizedCoreEvts<Usecase extends UsecaseLike> = (core: CoreLike) => {
    [Key in `${typeof wordId}${Capitalize<Extract<Usecase, { createEvt: any }>["name"]>}`]: ReturnType<
        Extract<
            Usecase,
            {
                name: Key extends `${typeof wordId}${infer CapitalizedName}`
                    ? Uncapitalize<CapitalizedName>
                    : never;
                createEvt: any;
            }
        >["createEvt"]
    >;
};

export function usecasesToEvts<Usecase extends UsecaseLike>(
    usecases: readonly Usecase[],
): {
    getMemoizedCoreEvts: GetMemoizedCoreEvts<Usecase>;
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
                usecases
                    .map(({ name, createEvt }) =>
                        createEvt === undefined ? undefined : { name, createEvt },
                    )
                    .filter(exclude(undefined))
                    .map(({ name, createEvt }) => [
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
