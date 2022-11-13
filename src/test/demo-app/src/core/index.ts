/*
NOTE: Only here do we export the API for a specific framework (here react).
In the rest of the core directory everything is agnostic to React
*/
import { createReactApi } from "redux-clean-architecture/react";
import { createCore } from "./setup";
import { usecases } from "./usecases";

export const {
	createCoreProvider,
	selectors,
	useCoreEvts,
	useCoreExtras,
	useCoreFunctions,
	useCoreState
} = createReactApi({
	createCore, usecases
})
