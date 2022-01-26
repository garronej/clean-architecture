# Canonical Clean Architecture setup

Don't try to figure out what the App actually accomplishes, it doesn't do anything that makes sense.  
The focus is on the architecture and showing off how types are inferred.

NOTE: Do not forget `"baseUrl": "src"` in `tsconfig.json` to be able to import without using relative path.
E.g. `import { ... } from "core";`.

-   Your app's `src` directory should contain a `core` dir that
    is the brain of your app and an `ui` dir that contains
    the UI components.
-   The `core` directory should be completely agnostic from the UI
    framework in use in the application. For example, if you are defining a hook somewhere in the `core` directory,
    you are doing it wrong. The `core` directory must never import anything from the `ui` directory.
    It must be possible to switch from Vue to React
    without changing a single line of code in the `core` directory.
-   All the interaction that your app is supposed to make with the outside work should be described, as type only
    in the `src/core/ports` directory.
    If, for example, your app consumes a REST API, you should create a port called, for example, `MyRestApiClient`.
-   The interfaces defined in `src/core/ports` should be implemented in the `src/core/secondaryAdapter` directory.
    Do not hesitate to provide multiple implementations for a single port. It is very useful for example to be able
    to provide a mock adapter for a given port if you wish to be able to run your application in degraded mode.
    For implementing `MyRestApiClient` you would for example create a file called `src/core/secondaryAdapters/createMyRestApiClient.ts`
    that internally make uses of a library like [`axios`](https://axios-http.com) to make the HTTP requests to your REST API.
-   The `src/core/usecases` directory should contains the method and states that will be needed to give the App an user interface.
-   The `middlewareEvtAction` is optional. It provides an [`Evt`](https://evt.land) that posts every time an action is dispatched.
    It allows, for example, [to wait for an other operation to complete before starting a new one](https://github.com/garronej/redux-clean-architecture/blob/1702d15b6ea395f2816734fe73a20fa4551ec679/src/test/demo-app/src/core/usecases/usecase1.ts#L51-L60).
    Find a documented usecase [here](https://docs.onyxia.dev/architecture#how-to-deal-with-project-switching).  
    > WARNING: It doesn't play well with `createAsyncThunk()`. If it's a problem for you,
    > please submit an issue.
    

Happy hacking!  
Do not hesitate to [start a discussion](https://github.com/garronej/redux-clean-architecture/discussions)!.
