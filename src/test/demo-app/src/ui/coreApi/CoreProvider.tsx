import { createCore } from "core";
import type { Core } from "core";
import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import { assert } from "tsafe/assert";

//How you instantiate the store will vary from project to project.
//This is just a mere suggestion so you get the idea.


const coreContext = createContext<Core | undefined>(undefined);

export function useCore(){
    const core = useContext(coreContext);
    assert(core !== undefined, "Not wrapped within CoreProvider");
    return core;
}

const prCore = createCore({
    "port1Config": {
        "port1Config1": "foo",
    },
    "port2Config": {
        "port2Config1": "bar",
        "port2Config2": "baz",
    },
});

export function CoreProvider(props: { children: ReactNode }) {
    const { children } = props;

    const [core, setCore] = useState<Core | undefined>(undefined);

    useEffect(() => {
        prCore.then(setCore);
    }, []);

    if (core === undefined) {
        //Suggestion: display a splash screen
        return null;
    }

    return (
        <coreContext.Provider value={core}>
            {children}
        </coreContext.Provider>
    );
}
