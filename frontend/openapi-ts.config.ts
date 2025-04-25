import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "./openapi.json",
	output: "src/generated/backend-client",
	plugins: [
		...defaultPlugins,
		"@hey-api/schemas",
		{
			name: "@hey-api/client-next",
			runtimeConfigPath: "./src/hey-api.ts",
		},
		"@tanstack/react-query",
		"zod",
		{
			name: "@hey-api/sdk",
			validator: true,
		},
	],
});
