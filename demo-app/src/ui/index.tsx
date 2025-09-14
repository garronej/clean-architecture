import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { bootstrapCore } from "core";
import { App } from "./App";
import { assert } from "tsafe/assert";

bootstrapCore({
    "port1Config": {
        "port1Config1": "foo"
    },
    "port2Config": {
        "port2Config1": "bar",
        "port2Config2": "baz"
    }
});

createRoot(
    (() => {
        const rootElement = document.getElementById("root");

        assert(rootElement !== null);

        return rootElement;
    })()
).render(
    <StrictMode>
        <App />
    </StrictMode>
);
