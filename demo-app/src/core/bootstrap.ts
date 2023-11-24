import { createPort2 } from "./adapters/createProt2";
import type { Port2Config } from "./adapters/createProt2";
import { createPort1 } from "./adapters/createPort1";
import type { Port1Config } from "./adapters/createPort1";
import { createCore } from "redux-clean-architecture";
import { usecases } from "./usecases";

type ParamsOfBootstrapCore = {
    port1Config: Port1Config;
    port2Config: Port2Config;
};

export async function bootstrapCore(params: ParamsOfBootstrapCore) {
    const [port1, port2] = await Promise.all([
        createPort1(params.port1Config),
        createPort2(params.port2Config)
    ]);

    const { core, dispatch } = createCore({
        "context": {
            "paramsOfBootstrapCore": params,
            port1,
            port2
        },
        usecases
    });

    await dispatch(usecases.usecase2.privateThunks.initialize());

    return { core, "context": { port1 } };
}

export type State = createCore.Infer<"State", typeof bootstrapCore>;
export type Thunks = createCore.Infer<"Thunks", typeof bootstrapCore>;
export type CreateEvt = createCore.Infer<"CreateEvt", typeof bootstrapCore>;
