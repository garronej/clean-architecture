export type Port2 = {
    port2Method1: (params: { port2Method2Param1: string }) => Promise<number>;
    port2Method2: () => boolean;
};
