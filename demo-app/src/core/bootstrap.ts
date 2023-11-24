import type { Port2Config } from "./adapters/createProt2";
import type { Port1Config } from "./adapters/createPort1";
import type { Port1 } from "./ports/Port1";
import type { Port2 } from "./ports/Port2";
import { createCore } from "redux-clean-architecture";
import type { MyCore } from "redux-clean-architecture/createCore";
import { usecases } from "./usecases";

type ParamsOfBootstrapCore = {
    port1Config: Port1Config;
    port2Config: Port2Config;
};

type Context = {
    paramsOfBootstrapCore: ParamsOfBootstrapCore;
    port1: Port1;
    port2: Port2;
};

type Core = MyCore<typeof usecases, Context>;

export async function bootstrapCore(params: ParamsOfBootstrapCore): Promise<{
    core: Core;
    context: Context;
}> {
    const [port1, port2] = await Promise.all([
        import("./adapters/createPort1").then(({ createPort1 }) => createPort1(params.port1Config)),
        import("./adapters/createProt2").then(({ createPort2 }) => createPort2(params.port2Config))
    ]);

    const context: Context = {
        "paramsOfBootstrapCore": params,
        port1,
        port2
    };

    const { core, dispatch } = createCore({
        "thunksExtraArgument": context,
        usecases
    });

    await dispatch(usecases.usecase2.privateThunks.initialize());

    return { core, context };
}

export type State = Core["types"]["State"];
export type Thunks = Core["types"]["Thunks"];
export type CreateEvt = Core["types"]["CreateEvt"];
