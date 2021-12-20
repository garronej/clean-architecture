import "minimal-polyfills/Object.fromEntries";
import { exclude } from "tsafe/exclude";

export function usecasesToPureFunctions<
    UseCase extends {
        name: string;
        pure?: unknown;
    },
>(
    useCases: readonly UseCase[],
): {
    [Key in Extract<UseCase, { pure: any }>["name"]]: NonNullable<
        Extract<UseCase, { name: Key }>["pure"]
    >;
} {
    return Object.fromEntries(
        useCases
            .map(({ name, pure }) => (pure === undefined ? undefined : ([name, pure] as const)))
            .filter(exclude(undefined))
            .map(([name, pure]) => [name, pure]),
    ) as any;
}
