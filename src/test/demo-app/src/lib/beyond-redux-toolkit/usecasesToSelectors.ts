import "minimal-polyfills/Object.fromEntries";
import type { Param0 } from "tsafe";
import { objectKeys } from "tsafe/objectKeys";
import { exclude } from "tsafe/exclude";

type WrapSelectorsReturnValue<Selectors extends { [Name in string]: (state: any) => unknown }> = {
    [Name in keyof Selectors]: (
        state: Param0<Selectors[Name]>,
    ) => Record<Name, ReturnType<Selectors[Name]>>;
};

/** See .types.test.ts */
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

/** See .types.test.ts */
export function usecasesToSelectors<
    UseCase extends {
        name: string;
        selectors?: { [Name in string]: (state: any) => unknown };
    },
>(
    useCases: readonly UseCase[],
): {
    [Key in Extract<UseCase, { selectors: any }>["name"]]: WrapSelectorsReturnValue<
        NonNullable<Extract<UseCase, { name: Key }>["selectors"]>
    >;
} {
    return Object.fromEntries(
        useCases
            .map(({ name, selectors }) =>
                selectors === undefined ? undefined : ([name, selectors] as const),
            )
            .filter(exclude(undefined))
            .map(([name, selector]) => [name, wrapSelectorsReturnValue(selector)]),
    ) as any;
}
