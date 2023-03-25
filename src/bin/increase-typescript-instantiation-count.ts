#!/usr/bin/env node

import { getProjectRoot } from "./tools/getProjectRoot";
import { crawl } from "./tools/crawl";
import * as fs from "fs";
import { join as pathJoin } from "path";

const typescriptDirPath = pathJoin(getProjectRoot(), "..", "typescript");

if (!fs.existsSync(typescriptDirPath)) {
    process.exit(0);
}

crawl(typescriptDirPath)
    .filter(filePath => filePath.endsWith(".js"))
    .map(relativeFilePath => pathJoin(typescriptDirPath, relativeFilePath))
    .forEach(jsFilePath => {
        const fileContentStr = fs.readFileSync(jsFilePath).toString("utf8");

        const fixedFileContentStr = fileContentStr.replace(
            /instantiationCount >=? [0-9e]+/g,
            "instantiationCount >= 5e10"
        );

        if (fixedFileContentStr.length === fileContentStr.length) {
            return;
        }

        fs.writeFileSync(jsFilePath, Buffer.from(fixedFileContentStr, "utf8"));
    });
