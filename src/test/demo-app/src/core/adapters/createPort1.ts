import type { Port1 } from "../ports/Port1";

export type Port1Config = {
    port1Config1: string;
};

export async function createPort1(params: Port1Config): Promise<Port1> {
    const { port1Config1 } = params;

    return {
        "port1Method1": async ({ port1Method1Param1 }) => `${port1Config1}${port1Method1Param1}`,
    };
}
