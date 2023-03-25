<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/151054088-b21c1cd6-912a-4dcf-b54d-af74e8632620.png">  
</p>
<p align="center">
    <i>📐 A clean architecture framework  📐</i>
    <br/>
    <i>🔩 Focusing on achieving great type inference 🔩</i>
    <br>
    <br>
    <a href="https://github.com/garronej/redux-clean-architecture/actions">
      <img src="https://github.com/garronej/redux-clean-architecture/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://bundlephobia.com/package/redux-clean-architecture">
      <img src="https://img.shields.io/bundlephobia/minzip/redux-clean-architecture">
    </a>
    <a href="https://github.com/garronej/redux-clean-architecture/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/redux-clean-architecture">
    </a>
</p>

-   [Benefits](#benefits)
-   [Install / Import](#install--import)
-   [Examples setups](#examples-setups)
    -   [Canonical setup](#canonical-setup)
    -   [Todos List app](#todos-list-app)
    -   [Enterprise grade app](#enterprise-grade-app)
-   [Opinionated restrictions](#opinionated-restrictions)
-   [Starting the demo app](#starting-the-demo-app)

# Benefits

-   Clean architecture without [the object-orientedness](https://www.youtube.com/watch?v=QM1iUe6IofM).
-   No need to explicitly call `dispatch()` on the UI side.  
    As a matter of fact, Redux being used
    under the hood is an implementation detail that can as well be ignored by the dev working on the UI.
-   Strict isolation between the Core and the UI. Port your web app to React Native or switch to another
    UI framework without having to re-write a single line of the core logic.
-   It's not specifically a React framework, it's not even specifically a frontend framework, it can and is be used on the backend.
-   Names things once, it propagate through all the codebase via [TypeScript's template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html). No more hard to maintain stuttering.  
    Name things once then let intellisense guide you.
-   The core can tell the UI to do thing imperatively. Like "Play a sound now" which is something that
    is impossible to do cleanly with just states. (`isSoundShouldBePlayedNow: boolean` ?)

# Install / Import

```bash
$ yarn add redux-clean-architecture evt @reduxjs/toolkit
```

# Examples setups

## Canonical setup

A canonical setup can be found here: [👉 `src/test/demo-app`👈 ](https://github.com/garronej/redux-clean-architecture/tree/main/src/test/demo-app).

## Enterprise grade app

You can consult the source code of [onyxia-web](https://github.com/InseeFrLab/onyxia-web) to see how `redux-clean-architecture` is used in a real world complex application.

<p align="center">
  <a href="https://github.com/InseeFrLab/onyxia-web">
  <i>Onyxia: A data science-oriented container launcher.</i>
    <img src="https://user-images.githubusercontent.com/6702424/139264787-37efc793-1d55-4fa4-a4a9-782af8357cff.png">
  </a>
</p>

# Starting the demo app

```bash
git clone https://github.com/garronej/redux-clean-architecture
cd redux-clean-architecture
yarn
yarn build
yarn start-demo-app
```

# type instantiation is execively deep and possibly infinit

If your app becomes very complex you might run into this error message.

<img width="656" alt="image" src="https://user-images.githubusercontent.com/6702424/227680365-07a8d499-4b66-4553-85a3-976aed87a62c.png">

To get rid of it simply add this script to your package json.

`package.json`

```json
"scripts": {
  "postinstall": "increase-typescript-instantiation-count"
}
```

Then make vscode use the workspace version of typescript and restart typescript server:  

https://user-images.githubusercontent.com/6702424/227682089-e42d36ba-9b53-401c-803b-94a1556a508f.mov
