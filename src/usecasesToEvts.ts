import "minimal-polyfills/Object.fromEntries";
import { capitalize } from "tsafe/capitalize";
import type { NonPostableEvt } from "evt";
import { exclude } from "tsafe/exclude";
import { Evt, type ToPostableEvt } from "evt";

const wordId = "evt";

export type StoreLike = {
    evtAction: NonPostableEvt<any>;
    getState: () => any;
};

export type GenericCreateEvt<Store extends StoreLike> = (params: {
    evtAction: Store["evtAction"];
    getState: Store["getState"];
}) => NonPostableEvt<any>;

export type UsecaseLike = {
    name: string;
    createEvt?: GenericCreateEvt<StoreLike>;
};

export type CoreEvts<Usecase extends UsecaseLike> = {
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

export function usecasesToEvts<Usecase extends UsecaseLike>(params: {
    usecasesArr: readonly Usecase[];
    store: StoreLike;
}): {
    evts: CoreEvts<Usecase>;
} {
    const { store, usecasesArr } = params;

    const { getState, evtAction } = store;

    const evts = Object.fromEntries(
        usecasesArr
            .map(({ name, createEvt }) => (createEvt === undefined ? undefined : { name, createEvt }))
            .filter(exclude(undefined))
            .map(({ name, createEvt }) => [
                `${wordId}${capitalize(name)}`,
                (() => {
                    const evt = createEvt({
                        evtAction,
                        getState
                    });

                    const evtAsync: ToPostableEvt<typeof evt> = new Evt();

                    evt.attach(data => Promise.resolve().then(() => evtAsync.post(data)));

                    return evtAsync;
                })()
            ])
    ) as any;

    return { evts };
}
