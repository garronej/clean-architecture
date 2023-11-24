/* eslint-disable no-lone-blocks */
import { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import type { NonPostableEvt } from "evt";
import { usecasesToEvts } from "../../usecasesToEvts";

{
    type Data1 = {
        _brandData1: unknown;
    };

    type Data2 = {
        _brandData2: unknown;
    };

    const usecasesArr = Reflect<
        [
            {
                name: "firstSlice";
                createEvt: (params: any) => NonPostableEvt<Data1>;
            },
            {
                name: "secondSlice";
                createEvt: (params: any) => NonPostableEvt<Data2>;
            },

            {
                name: "thirdSlice";
            }
        ]
    >();

    const { evts: got } = usecasesToEvts({
        usecasesArr,
        "store": {
            "getState": Reflect<() => Record<string, unknown>>(),
            "evtAction": Reflect<NonPostableEvt<any>>()
        }
    });

    const expected = Reflect<{
        evtFirstSlice: NonPostableEvt<Data1>;
        evtSecondSlice: NonPostableEvt<Data2>;
    }>();

    assert<Equals<typeof got, typeof expected>>();
}

//Test if it works if there is no slice with a createEvt
{
    const usecasesArr = Reflect<
        [
            {
                name: "firstSlice";
            }
        ]
    >();

    const { evts: got } = usecasesToEvts({
        usecasesArr,
        "store": {
            "getState": Reflect<() => Record<string, unknown>>(),
            "evtAction": Reflect<NonPostableEvt<any>>()
        }
    });

    const expected = Reflect<{}>();

    assert<Equals<typeof got, typeof expected>>();
}
