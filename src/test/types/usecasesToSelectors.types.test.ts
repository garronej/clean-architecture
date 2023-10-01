import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import { Equals } from "tsafe";
import { wrapSelectorsReturnValue, usecasesToSelectors } from "../../usecasesToSelectors";

{
    const selectors = {
        "foo": Reflect<(state: any) => string>(),
        "bar": Reflect<(state: any) => number>()
    };

    const got = wrapSelectorsReturnValue(selectors);

    type Expected = {
        foo: (state: any) => { foo: string };
        bar: (state: any) => { bar: number };
    };

    assert<Equals<typeof got, Expected>>();
}

{
    const usecasesArr = [
        {
            "name": "myFirstUsecase",
            "selectors": {
                "foo": Reflect<(state: any) => string>(),
                "bar": Reflect<(state: any) => number>()
            }
        },
        {
            "name": "mySecondUsecase",
            "selectors": { "baz": Reflect<(state: any) => boolean>() }
        },
        { "name": "myThirdSlice" }
    ] as const;

    const got = usecasesToSelectors({ usecasesArr });

    type Expected = {
        myFirstUsecase: {
            readonly foo: (state: any) => { foo: string };
            readonly bar: (state: any) => { bar: number };
        };
        mySecondUsecase: { readonly baz: (state: any) => { baz: boolean } };
    };

    assert<Equals<typeof got, Expected>>();
}
