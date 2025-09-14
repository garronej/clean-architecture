/*
NOTE: Only here do we export the API for a specific framework (here react).
In the rest of the core directory everything is agnostic to React
*/
import { createReactApi } from "clean-architecture/react";
import * as bootstrap from "./bootstrap";

export const { useCoreState, getCoreSync, bootstrapCore } = createReactApi({
    bootstrapCore: bootstrap.bootstrapCore
});
