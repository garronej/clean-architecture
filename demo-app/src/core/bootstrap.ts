import { createPort2 } from "./adapters/createProt2";
import type { Port2Config } from "./adapters/createProt2";
import { createPort1 } from "./adapters/createPort1";
import type { Port1Config } from "./adapters/createPort1";
import { createCore } from "redux-clean-architecture";
import type { MyCore } from "redux-clean-architecture/createCore";
import { usecases } from "./usecases";
import type { ReturnType } from "tsafe";

type ParamsOfBootstrapCore = {
    port1Config: Port1Config;
    port2Config: Port2Config;
};

type Context = {
    paramsOfBootstrapCore: ParamsOfBootstrapCore;
    port1: ReturnType<typeof createPort1>;
    port2: ReturnType<typeof createPort2>;
};

type Core = MyCore<typeof usecases, Context>;

export async function bootstrapCore(params: ParamsOfBootstrapCore): Promise<{
    core: Core;
    context: {
        port1: ReturnType<typeof createPort1>;
    };
}> {
    const [port1, port2] = await Promise.all([
        createPort1(params.port1Config),
        createPort2(params.port2Config)
    ]);

    const { core, dispatch } = createCore({
        /*
        "context": {
            "paramsOfBootstrapCore": params,
            port1,
            port2
        },
        */
        "thunksExtraArgument": {
            "paramsOfBootstrapCore": params,
            port1,
            port2
        },
        usecases
    });

    await dispatch(usecases.usecase2.privateThunks.initialize());

    return { core, "context": { port1 } };
}

export type State = Core["~internal"]["ofTypeState"];
export type Thunks = Core["~internal"]["ofTypeThunks"];
export type CreateEvt = Core["~internal"]["ofTypeCreateEvt"];
