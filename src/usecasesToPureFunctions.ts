import "minimal-polyfills/Object.fromEntries";
import { exclude } from "tsafe/exclude";

export function usecasesToPureFunctions<
    Usecase extends {
        name: string;
        pure?: unknown;
    },
>(
    usecases: readonly Usecase[],
): {
    [Key in Extract<Usecase, { pure: any }>["name"]]: NonNullable<
        Extract<Usecase, { name: Key }>["pure"]
    >;
} {
    return Object.fromEntries(
        usecases
            .map(({ name, pure }) => (pure === undefined ? undefined : ([name, pure] as const)))
            .filter(exclude(undefined))
            .map(([name, pure]) => [name, pure]),
    ) as any;
}
