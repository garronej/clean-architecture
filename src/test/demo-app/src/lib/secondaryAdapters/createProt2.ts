import type { Port2 } from "../ports/Port2";

export type Port2Config = {
    port2Config1: string;
    port2Config2: string;
};

export async function createPort2(params: Port2Config): Promise<Port2> {
    const { port2Config1, port2Config2 } = params;

    return {
        "port2Method1": async ({ port2Method2Param1 }) => {
            await new Promise(resolve => setTimeout(resolve, 200));

            return `${port2Config1}${port2Method2Param1}`.length;
        },
        "port2Method2": () => port2Config2 === "",
    };
}
