import { resolve } from "path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    setupFiles: ["./test/setup-e2e.ts"],
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
    tsConfigPaths(),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
    },
  },
});
