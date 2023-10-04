import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import { Equals } from "tsafe";
import { usecasesToGetSelectedState } from "../../usecasesToGetSelectedState";

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

    const { getSelectedState } = usecasesToGetSelectedState({
        usecasesArr,
        "store": {
            "getState": Reflect<() => any>()
        }
    });

    {
        const got = getSelectedState({
            "usecase": "myFirstUsecase",
            "selector": "foo"
        });

        type Expected = {
            foo: string;
        };

        assert<Equals<typeof got, Expected>>();
    }
    {
        const got = getSelectedState({
            "usecase": "myFirstUsecase",
            "selector": "bar"
        });

        type Expected = {
            bar: number;
        };

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = getSelectedState({
            "usecase": "mySecondUsecase",
            "selector": "baz"
        });

        type Expected = {
            baz: boolean;
        };

        assert<Equals<typeof got, Expected>>();
    }
}
