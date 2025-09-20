import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import unused from "eslint-plugin-unused-imports";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.browser,
		},
		plugins: {
			import: importPlugin,
			promise: promisePlugin,
			"unused-imports": unused,
		},
		settings: { "import/resolver": { node: { extensions: [".ts", ".tsx"] } } },
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		rules: {
			// keep it practical
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"error",
				{ args: "after-used", argsIgnorePattern: "^_" },
			],
			"import/order": [
				"warn",
				{
					groups: [
						["builtin", "external", "internal"],
						["parent", "sibling", "index"],
					],
					"newlines-between": "always",
				},
			],
			"promise/catch-or-return": "warn",
			"promise/no-return-wrap": "warn",
			"no-console": ["warn", { allow: ["error", "warn"] }],
		},
	},
]);
