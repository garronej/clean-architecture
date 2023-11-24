import "minimal-polyfills/Object.fromEntries";
import { capitalize } from "tsafe/capitalize";

export type UsecaseLike = {
    name: string;
    selectors?: { [Name in string]: (state: any) => unknown };
};

export type CoreStates<Usecase extends UsecaseLike> = {
    [U in Usecase as U["name"]]: U["selectors"] extends infer Selectors
        ? {
              [K in keyof Selectors as `get${Capitalize<string & K>}`]: () => Selectors[K] extends (
                  state: any
              ) => infer R
                  ? R
                  : never;
          }
        : never;
};

export function usecasesToStates<Usecase extends UsecaseLike>(params: {
    usecasesArr: readonly Usecase[];
    store: {
        getState: () => any;
    };
}): { states: CoreStates<Usecase> } {
    const { usecasesArr, store } = params;

    const states: CoreStates<Usecase> = Object.fromEntries(
        usecasesArr
            .map(({ name, selectors }) => [
                name,
                selectors === undefined
                    ? undefined
                    : Object.fromEntries(
                          Object.entries(selectors).map(
                              ([selectorName, selector]) =>
                                  [
                                      `get${capitalize(selectorName)}`,
                                      () => selector(store.getState())
                                  ] as const
                          )
                      )
            ])
            .filter(([, selectorWrap]) => selectorWrap !== undefined)
    );

    return { states };
}
