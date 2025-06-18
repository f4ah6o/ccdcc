import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "ccdcc",
			fileName: "index",
			formats: ["es"],
		},
		rollupOptions: {
			external: [
				"commander",
				"chalk",
				"inquirer",
				"@anthropic-ai/claude-code",
				"node:fs",
				"node:fs/promises",
				"node:path",
			],
		},
		target: "node18",
		outDir: "dist",
		minify: false,
	},
	define: {
		__dirname: JSON.stringify(__dirname),
	},
});
