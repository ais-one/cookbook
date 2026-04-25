/** Package name from `npm_package_name` env var (set by npm at runtime). */
export const name: string | undefined = process.env.npm_package_name;

/** Package version from `npm_package_version` env var (set by npm at runtime). */
export const version: string | undefined = process.env.npm_package_version;

/** Serialised dependencies string from `npm_package_dependencies` env var. */
export const dependencies: string | undefined = process.env.npm_package_dependencies;
