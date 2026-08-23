import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Relume's generated components consistently bundle refs together with
    // other state/handlers into a single `useRelume()` return object, then
    // forward `ref={active.someRef}` to JSX. That's a normal, legal ref
    // hand-off, but the compiler's static analysis can't see past the
    // destructured object and flags every property access on `active` as a
    // ref read during render. Scoped off rather than rewriting Relume's
    // convention across every ported component.
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The original Relume export — kept as a read-only reference, not app source.
    "cececo-website-project-design/**",
  ]),
]);

export default eslintConfig;
