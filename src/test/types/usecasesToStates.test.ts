import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import { Equals } from "tsafe";
import { usecasesToStates } from "../../usecasesToStates";

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

    const { states } = usecasesToStates({
        usecasesArr,
        "store": {
            "getState": Reflect<() => any>()
        }
    });

    {
        const got = states.myFirstUsecase.getFoo();

        type Expected = string;

        assert<Equals<typeof got, Expected>>();
    }
    {
        const got = states.myFirstUsecase.getBar();

        type Expected = number;

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = states.mySecondUsecase.getBaz();

        type Expected = boolean;

        assert<Equals<typeof got, Expected>>();
    }
}
