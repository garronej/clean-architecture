import "minimal-polyfills/Object.fromEntries";
import type { Param0 } from "tsafe";
import { objectKeys } from "tsafe/objectKeys";
import { exclude } from "tsafe/exclude";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";

export type UsecaseLike = {
    name: string;
    selectors?: { [Name in string]: (state: any) => unknown };
};

type GenericGetSelectedStateParam<Usecase extends UsecaseLike> = Usecase extends {
    name: infer N;
    selectors: infer S;
}
    ? N extends string
        ? S extends Record<string, (state: any) => any>
            ? {
                  usecase: N;
                  selector: keyof S;
              }
            : never
        : never
    : never;

type GenericGetSelectedStateReturnType<
    Usecase extends UsecaseLike,
    Params extends GenericGetSelectedStateParam<Usecase>
> = Usecase extends { name: Params["usecase"]; selectors: infer Selectors }
    ? Params["selector"] extends keyof Selectors
        ? Selectors[Params["selector"]] extends (state: any) => infer R
            ? R
            : never
        : never
    : never;

type GenericGetSelectedState<Usecase extends UsecaseLike> = <
    Params extends GenericGetSelectedStateParam<Usecase>
>(
    params: Params
) => Record<Params["selector"], GenericGetSelectedStateReturnType<Usecase, Params>>;

export function usecasesToGetSelectedState<Usecase extends UsecaseLike>(params: {
    usecasesArr: readonly Usecase[];
    store: {
        getState: () => any;
    };
}): { getSelectedState: GenericGetSelectedState<Usecase> } {
    const { usecasesArr, store } = params;

    const getSelectedState: any = (params: { usecase: string; selector: string }) => {
        const usecase = usecasesArr.find(({ name }) => name === params.usecase);

        assert(usecase !== undefined);
        assert(usecase.selectors !== undefined);

        const selector = usecase.selectors[params.selector];

        assert(selector !== undefined);

        const value = selector(store.getState());

        return { [params.selector]: value };
    };

    return { getSelectedState };
}

/*
type Usecase = {
    name: "myFirstUsecase";
    selectors: {
        "myFirstSelector": (state: any) => number;
        "mySecondSelector": (state: any) => string;
    }
} | {
    name: "mySecondUsecase";
    selectors: {
        "myThirdSelector": (state: any) => boolean;
        "myFourthSelector": (state: any) => number | string;
    }
};


{

    type Got = GenericGetSelectedState<Usecase>;

    const x: Got=null as any;

    const { myFourthSelector } = x({
        "usecase": "mySecondUsecase",
        "selector": "myFourthSelector"
    });


}


{

    type Got = GenericGetSelectedStateReturnType<Usecase, { usecase: "myFirstUsecase"; selector: "myFirstSelector"; }>;

    type Expected = number;

    assert<Equals<Got, Expected>>();

}

{

    type Got = GenericGetSelectedStateReturnType<Usecase, { usecase: "myFirstUsecase"; selector: "mySecondSelector"; }>;

    type Expected = string;

    assert<Equals<Got, Expected>>();

}

{

    type Got = GenericGetSelectedStateReturnType<Usecase, { usecase: "mySecondUsecase"; selector: "myThirdSelector"; }>;

    type Expected = boolean;

    assert<Equals<Got, Expected>>();

}

{

    type Got = GenericGetSelectedStateReturnType<Usecase, { usecase: "mySecondUsecase"; selector: "myFourthSelector"; }>;

    type Expected = number | string;

    assert<Equals<Got, Expected>>();

}

type Params =
    | {
        usecase: "myFirstUsecase";
        selector: "myFirstSelector" | "mySecondSelector";
    }
    | {
        usecase: "mySecondUsecase";
        selector: "myThirdSelector" | "myFourthSelector";
    };

{

    type Got = GenericGetSelectedStateParam<Usecase>;

    type Expected = Params;

    assert<Equals<Got, Expected>>();


}
*/
