import "minimal-polyfills/Object.fromEntries";
import type { Param0 } from "tsafe";
import { objectKeys } from "tsafe/objectKeys";
import { exclude } from "tsafe/exclude";

export type UsecaseLike = {
    name: string;
    selectors?: { [Name in string]: (state: any) => unknown };
};

type WrapSelectorsReturnValue<Selectors extends { [Name in string]: (state: any) => unknown }> = {
    [Name in keyof Selectors]: (
        state: Param0<Selectors[Name]>
    ) => Record<Name, ReturnType<Selectors[Name]>>;
};

export function wrapSelectorsReturnValue<
    Selectors extends { [Name in string]: (state: any) => unknown }
>(selectors: Selectors): WrapSelectorsReturnValue<Selectors> {
    return Object.fromEntries(
        objectKeys(selectors).map(name => [
            name,
            (state: Param0<Selectors[typeof name]>) => ({
                [name]: selectors[name](state)
            })
        ])
    ) as any;
}

export type GenericSelectors<Usecase extends UsecaseLike> = {
    [Key in Extract<Usecase, { selectors: any }>["name"]]: WrapSelectorsReturnValue<
        NonNullable<Extract<Usecase, { name: Key }>["selectors"]>
    >;
};

export function usecasesToSelectors<Usecase extends UsecaseLike>(params: {
    usecasesArr: readonly Usecase[];
}): GenericSelectors<Usecase> {
    const { usecasesArr } = params;

    return Object.fromEntries(
        usecasesArr
            .map(({ name, selectors }) =>
                selectors === undefined ? undefined : ([name, selectors] as const)
            )
            .filter(exclude(undefined))
            .map(([name, selector]) => [name, wrapSelectorsReturnValue(selector)])
    ) as any;
}
