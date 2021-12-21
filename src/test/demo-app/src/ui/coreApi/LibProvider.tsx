import { Provider as StoreProvider } from "react-redux";
import { createStore } from "core";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

//How you instantiate the store will vary from project to project.
//This is just a mere suggestion so you get the idea.

const prStore = createStore({
    "port1Config": {
        "port1Config1": "foo",
    },
    "port2Config": {
        "port2Config1": "bar",
        "port2Config2": "baz",
    },
});

export function LibProvider(props: { children: ReactNode }) {
    const { children } = props;

    const [store, setStore] = useState<Awaited<typeof prStore> | undefined>(undefined);

    useEffect(() => {
        prStore.then(setStore);
    }, []);

    if (store === undefined) {
        //Suggestion: display a splash screen
        return null;
    }

    return <StoreProvider store={store}>{children}</StoreProvider>;
}
