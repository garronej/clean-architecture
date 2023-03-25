/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { execSync } from "child_process";
import { join as pathJoin, relative as pathRelative } from "path";
import * as fs from "fs";

const projectRootDirPath = pathJoin(__dirname, "..");

fs.writeFileSync(
    pathJoin(projectRootDirPath, "dist", "package.json"),
    Buffer.from(
        JSON.stringify(
            (() => {
                const packageJsonParsed = JSON.parse(
                    fs.readFileSync(pathJoin(projectRootDirPath, "package.json")).toString("utf8")
                );

                return {
                    ...packageJsonParsed,
                    "main": packageJsonParsed["main"]?.replace(/^dist\//, ""),
                    "types": packageJsonParsed["types"]?.replace(/^dist\//, ""),
                    "module": packageJsonParsed["module"]?.replace(/^dist\//, ""),
                    "bin": !("bin" in packageJsonParsed)
                        ? undefined
                        : Object.fromEntries(
                              Object.entries(packageJsonParsed["bin"]).map(([key, value]) => [
                                  key,
                                  (value as string).replace(/^dist\//, "")
                              ])
                          ),
                    "exports": !("exports" in packageJsonParsed)
                        ? undefined
                        : Object.fromEntries(
                              Object.entries(packageJsonParsed["exports"]).map(([key, value]) => [
                                  key,
                                  (value as string).replace(/^\.\/dist\//, "./")
                              ])
                          )
                };
            })(),
            null,
            2
        ),
        "utf8"
    )
);

const commonThirdPartyDeps = (() => {
    const namespaceModuleNames: string[] = [];
    const standaloneModuleNames = ["react", "@reduxjs/toolkit", "evt"];

    return [
        ...namespaceModuleNames
            .map(namespaceModuleName =>
                fs
                    .readdirSync(pathJoin(projectRootDirPath, "node_modules", namespaceModuleName))
                    .map(submoduleName => `${namespaceModuleName}/${submoduleName}`)
            )
            .reduce((prev, curr) => [...prev, ...curr], []),
        ...standaloneModuleNames
    ];
})();

const yarnHomeDirPath = pathJoin(projectRootDirPath, ".yarn_home");

execSync(["rm -rf", "mkdir"].map(cmd => `${cmd} ${yarnHomeDirPath}`).join(" && "));

const execYarnLink = (params: { targetModuleName?: string; cwd: string }) => {
    const { targetModuleName, cwd } = params;

    const cmd = ["yarn", "link", ...(targetModuleName !== undefined ? [targetModuleName] : [])].join(
        " "
    );

    console.log(`$ cd ${pathRelative(projectRootDirPath, cwd) || "."} && ${cmd}`);

    execSync(cmd, {
        cwd,
        "env": {
            ...process.env,
            "HOME": yarnHomeDirPath
        }
    });
};

const testAppNames = ["demo-app"] as const;

const getTestAppPath = (testAppName: typeof testAppNames[number]) =>
    pathJoin(projectRootDirPath, testAppName);

testAppNames.forEach(testAppName => execSync("yarn install", { "cwd": getTestAppPath(testAppName) }));

console.log("=== Linking common dependencies ===");

const total = commonThirdPartyDeps.length;
let current = 0;

commonThirdPartyDeps.forEach(commonThirdPartyDep => {
    current++;

    console.log(`${current}/${total} ${commonThirdPartyDep}`);

    const localInstallPath = pathJoin(
        ...[
            projectRootDirPath,
            "node_modules",
            ...(commonThirdPartyDep.startsWith("@")
                ? commonThirdPartyDep.split("/")
                : [commonThirdPartyDep])
        ]
    );

    execYarnLink({ "cwd": localInstallPath });

    testAppNames.forEach(testAppName =>
        execYarnLink({
            "cwd": getTestAppPath(testAppName),
            "targetModuleName": commonThirdPartyDep
        })
    );
});

console.log("=== Linking in house dependencies ===");

execYarnLink({ "cwd": pathJoin(projectRootDirPath, "dist") });

testAppNames.forEach(testAppName =>
    execYarnLink({
        "cwd": getTestAppPath(testAppName),
        "targetModuleName": "redux-clean-architecture"
    })
);
