import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import { Equals } from "tsafe";
import { wrapSelectorsReturnValue, usecasesToSelectors } from "../../usecasesToSelectors";

{
    const selectors = {
        "foo": Reflect<(state: any) => string>(),
        "bar": Reflect<(state: any) => number>(),
    };

    const got = wrapSelectorsReturnValue(selectors);

    type Expected = {
        foo: (state: any) => { foo: string };
        bar: (state: any) => { bar: number };
    };

    assert<Equals<typeof got, Expected>>();
}

{
    const useCases = [
        {
            "name": "myFirstSlice",
            "selectors": {
                "foo": Reflect<(state: any) => string>(),
                "bar": Reflect<(state: any) => number>(),
            },
        },
        {
            "name": "mySecondSlice",
            "selectors": { "baz": Reflect<(state: any) => boolean>() },
        },
        { "name": "myThirdSlice" },
    ] as const;

    const got = usecasesToSelectors(useCases);

    type Expected = {
        myFirstSlice: {
            readonly foo: (state: any) => { foo: string };
            readonly bar: (state: any) => { bar: number };
        };
        mySecondSlice: { readonly baz: (state: any) => { baz: boolean } };
    };

    assert<Equals<typeof got, Expected>>();
}
