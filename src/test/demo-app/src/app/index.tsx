import { render } from "react-dom";
import { LibProvider } from "./libApi/LibProvider";
import { App } from "./App";

render(
    <LibProvider>
        <App />
    </LibProvider>,
    document.getElementById("root"),
);
