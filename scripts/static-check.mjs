import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const srcRoot = path.join(root, "src");
const failures = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function fail(message) {
  failures.push(message);
}

for (const file of ["package.json", "tsconfig.json"]) {
  try {
    JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch (error) {
    fail(`${file} is not valid JSON: ${error.message}`);
  }
}

const sourceFiles = walk(srcRoot).filter((file) => /\.(?:ts|tsx|css)$/.test(file));
const moduleExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

function moduleExists(basePath) {
  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) return true;
  if (moduleExtensions.some((extension) => fs.existsSync(`${basePath}${extension}`))) return true;
  return (
    fs.existsSync(basePath) &&
    fs.statSync(basePath).isDirectory() &&
    moduleExtensions.some((extension) => fs.existsSync(path.join(basePath, `index${extension}`)))
  );
}

for (const file of sourceFiles.filter((item) => /\.(?:ts|tsx)$/.test(item))) {
  const contents = fs.readFileSync(file, "utf8");
  const importPattern = /(?:from\s+|import\s*\()\s*["']([^"']+)["']/g;
  for (const match of contents.matchAll(importPattern)) {
    const specifier = match[1];
    const candidate = specifier.startsWith("@/")
      ? path.join(srcRoot, specifier.slice(2))
      : specifier.startsWith(".")
        ? path.resolve(path.dirname(file), specifier)
        : null;
    if (candidate && !moduleExists(candidate) && !specifier.endsWith(".css")) {
      fail(`Broken local import in ${path.relative(root, file)}: ${specifier}`);
    }
  }

  if (
    contents.includes('"use client"') &&
    contents.includes("process.env.SUPABASE_SERVICE_ROLE_KEY")
  ) {
    fail(`Server secret referenced by a client component: ${path.relative(root, file)}`);
  }
}

const assetPattern = /["'`](\/[^"'`\s)]+\.(?:png|jpe?g|webp|avif|svg|ico))["'`)]/gi;
for (const file of sourceFiles) {
  const contents = fs.readFileSync(file, "utf8");
  for (const match of contents.matchAll(assetPattern)) {
    const assetPath = path.join(root, "public", match[1].replace(/^\//, ""));
    if (!fs.existsSync(assetPath)) {
      fail(`Missing static asset referenced by ${path.relative(root, file)}: ${match[1]}`);
    }
  }
}

const css = fs.readFileSync(path.join(srcRoot, "app", "globals.css"), "utf8");
let braceBalance = 0;
for (const character of css) {
  if (character === "{") braceBalance += 1;
  if (character === "}") braceBalance -= 1;
  if (braceBalance < 0) break;
}
if (braceBalance !== 0) fail(`globals.css has an invalid brace balance: ${braceBalance}`);

const requiredFiles = [
  "proxy.ts",
  "supabase/migrations/202608020001_phase5.sql",
  "src/app/[locale]/layout.tsx",
  "src/app/[locale]/admin/page.tsx",
  "src/app/[locale]/participants/page.tsx",
  "src/app/api/admin/participants/route.ts",
  "src/lib/supabase/admin.ts",
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Required Phase 5 file is missing: ${file}`);
}

if (failures.length) {
  console.error(`Static validation failed with ${failures.length} issue(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Static validation passed: ${sourceFiles.length} source files checked.`);
