import "minimal-polyfills/Object.fromEntries";
import type { Param0 } from "tsafe";
import { objectKeys } from "tsafe/objectKeys";
import { exclude } from "tsafe/exclude";

type WrapSelectorsReturnValue<Selectors extends { [Name in string]: (state: any) => unknown }> = {
    [Name in keyof Selectors]: (
        state: Param0<Selectors[Name]>,
    ) => Record<Name, ReturnType<Selectors[Name]>>;
};

export function wrapSelectorsReturnValue<
    Selectors extends { [Name in string]: (state: any) => unknown },
>(selectors: Selectors): WrapSelectorsReturnValue<Selectors> {
    return Object.fromEntries(
        objectKeys(selectors).map(name => [
            name,
            (state: Param0<Selectors[typeof name]>) => ({
                [name]: selectors[name](state),
            }),
        ]),
    ) as any;
}

export function usecasesToSelectors<
    Usecase extends {
        name: string;
        selectors?: { [Name in string]: (state: any) => unknown };
    },
>(
    usecases: readonly Usecase[],
): {
    [Key in Extract<Usecase, { selectors: any }>["name"]]: WrapSelectorsReturnValue<
        NonNullable<Extract<Usecase, { name: Key }>["selectors"]>
    >;
} {
    return Object.fromEntries(
        usecases
            .map(({ name, selectors }) =>
                selectors === undefined ? undefined : ([name, selectors] as const),
            )
            .filter(exclude(undefined))
            .map(([name, selector]) => [name, wrapSelectorsReturnValue(selector)]),
    ) as any;
}
