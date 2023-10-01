import { createPort2 } from "./adapters/createProt2";
import type { Port2Config } from "./adapters/createProt2";
import { createPort1 } from "./adapters/createPort1";
import type { Port1Config } from "./adapters/createPort1";
import { createCoreFromUsecases, type Scaffolding } from "redux-clean-architecture";
import { usecases } from "./usecases";

type CoreParams = {
    port1Config: Port1Config;
    port2Config: Port2Config;
};

export async function setup(params: CoreParams) {
    const [port1, port2] = await Promise.all([
        createPort1(params.port1Config),
        createPort2(params.port2Config)
    ]);

    const { core, dispatch } = createCoreFromUsecases({
        "context": {
            "coreParams": params,
            port1,
            port2
        },
        usecases
    });

    await dispatch(usecases.usecase2.privateThunks.initialize());

    return { core, "context": { port1 } };
}

type _ = Scaffolding<typeof setup>;

export type State = _["State"];
export type Thunks = _["Thunks"];
export type CreateEvt = _["CreateEvt"];
