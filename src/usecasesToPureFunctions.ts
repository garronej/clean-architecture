import "minimal-polyfills/Object.fromEntries";
import { exclude } from "tsafe/exclude";

export type UsecaseLike = {
    name: string;
    pure?: unknown;
};

export function usecasesToPureFunctions<Usecase extends UsecaseLike>(
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
