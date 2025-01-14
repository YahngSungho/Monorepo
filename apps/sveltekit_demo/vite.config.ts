import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },

  plugins: [paraglide({
    project: "./project.inlang",
    outdir: "./src/lib/paraglide"
  })]
});
