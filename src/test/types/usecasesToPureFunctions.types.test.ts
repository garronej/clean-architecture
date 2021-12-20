import { usecasesToPureFunctions } from "../../usecasesToPureFunctions";
import { Reflect } from "tsafe/Reflect";
import { Equals } from "tsafe";
import { assert } from "tsafe/assert";

{
    type Pure1 = {
        _bradPure1: unknown;
    };

    type Pure2 = {
        _brandPure2: unknown;
    };

    const usecases = [
        {
            "name": "myFirstSlice",
            "pure": Reflect<Pure1>(),
        },
        {
            "name": "mySecondSlice",
            "pure": Reflect<Pure2>(),
        },
        { "name": "myThirdSlice" },
    ] as const;

    const got = usecasesToPureFunctions(usecases);

    const expected = Reflect<{
        myFirstSlice: Pure1;
        mySecondSlice: Pure2;
    }>();

    assert<Equals<typeof got, typeof expected>>();
}
