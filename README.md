<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/147236719-6733bf4d-947b-47bf-a81f-b186fe78ad14.png">  
</p>
<p align="center">
    <i>📐 Toolkit for implementing <b>clean architecture</b> using <b>Redux</b> 📐</i>
    <br/>
    <i>🔩 Focuses on achieving great type inference 🔩</i>
    <br/>
    <i>🎯 Easy to navigate, easy to maintain 🎯</i>
    <br>
    <br>
    <a href="https://github.com/garronej/clean-redux/actions">
      <img src="https://github.com/garronej/clean-redux/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://bundlephobia.com/package/clean-redux">
      <img src="https://img.shields.io/bundlephobia/minzip/clean-redux">
    </a>
    <!--
    <a href="https://www.npmjs.com/package/clean-redux">
      <img src="https://img.shields.io/npm/dw/clean-redux">
    </a>
    -->
    <a href="https://github.com/garronej/clean-redux/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/clean-redux">
    </a>
</p>

This repo aims to be a guide on how to implement Clean Architecture using [`@reduxjs/toolkit`](https://redux-toolkit.js.org).  
The NPM library `clean-redux` is a set of utils that you will need to achieve perfect type inference.

-   [Benefits](#benefits)
-   [Install / Import](#install--import)
-   [Opinionated restrictions](#opinionated-restrictions)
-   [Documentation](#documentation)
-   [A production example](#a-production-example)
-   [Starting the demo app](#starting-the-demo-app)

# Benefits

Implementing the approach exposed here enables large-scale app to remain maintainable for years even in the context
of frequent developer turnover.
The provided utilities internally leverage [TypeScript's template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) witch makes the developer experience truly next level.

https://user-images.githubusercontent.com/6702424/147381177-346293ec-8562-4aa4-ac62-45a5404d7ccc.mov

Note that there is no need to explicitly call `dispatch` and the result of the selector are automatically
wrapped into object so they can be destructured with the correct name.
Note also that in the examples we use React but `clean-redux` is UI framework agnostic.

# Install / Import

```bash
$ yarn add @reduxjs/toolkit clean-redux
```

# Opinionated restrictions

Because a [programing paradigm work by removing a freedom of some kind](https://youtu.be/wyABTfR9UTU?t=109), this is what you **can't** do if you chose to use this toolkit:

-   The UI isn't allowed to dispatch action directly, the UI dispatch thunks (synchronous or asynchronous)
    that internally dispatches actions. This approach forces you to keep your reducers plain and simple and to think
    of your thunks as the API exposed to the UI.
-   I advise against using `createAsyncThunk()`. It's preferable to decide what
    actions get dispatched when a thunk start, when it fails and when it completes
    on a case-by-case basis, pending, rejected and fulfilled is a one-size-fits-**not**-all
    patterns.
    If you do choose to use it anyway, clean-redux will comply but you will loose some degree
    of type safety.

# Documentation

Canonical Clean Architecture setup: [`src/test/demo-app`](https://github.com/garronej/clean-redux/tree/main/src/test/demo-app).  
You can also refer to [@leosuncin/redux-clean-example](https://github.com/leosuncin/redux-clean-example) that feature [the
classic counter example](https://user-images.githubusercontent.com/6702424/148482441-41f411e4-d466-4e0c-a898-c8e536bbcd14.png).

To understand what the functions exposed by `clean-redux` do in detail, please refer to
[the compile time unit tests](https://github.com/garronej/clean-redux/tree/main/src/test/types)
they worth more than a thousand words.

# A production example

<p align="center">
  <a href="https://github.com/InseeFrLab/onyxia-web">
  <i>Onyxia: A data science-oriented container launcher.</i>
    <img src="https://user-images.githubusercontent.com/6702424/139264787-37efc793-1d55-4fa4-a4a9-782af8357cff.png">
  </a>
</p>

# Starting the demo app

```bash
git clone https://github.com/garronej/clean-redux
cd clean-redux
yarn
yarn build
yarn start-demo-app
```
