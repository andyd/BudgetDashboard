#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Enhanced Project Setup Q&A
 *
 * Captures project context and generates AI-friendly files
 * that Claude Code and other tools can reference throughout development.
 *
 * Run: pnpm customize
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ROOT = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function toKebab(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseList(input) {
  if (!input || !input.trim()) return [];
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  console.log("\nProject Setup\n");
  console.log("Answer a few questions to configure your project.\n");

  // 1. App name
  const rawName = await ask("App name (kebab-case, e.g. recipe-finder): ");
  const appName = toKebab(rawName || "my-app");

  // 2. Purpose
  const description = await ask("What is the app for? (1-2 sentences): ");

  // 3. Inspiration URLs
  const rawInspiration = await ask(
    "Inspiration URLs (comma-separated, optional): ",
  );
  const inspirationUrls = parseList(rawInspiration);

  // 4. Reference docs
  const rawDocs = await ask(
    "Reference docs - PRDs, designs, specs (comma-separated, optional): ",
  );
  const referenceDocs = parseList(rawDocs);

  console.log("\nGenerating project files...\n");

  const generated = [];

  // Generate PROJECT_BRIEF.md
  generateProjectBrief(appName, description, inspirationUrls, referenceDocs);
  generated.push("PROJECT_BRIEF.md");

  // Update package.json
  updatePackageJson(appName);
  generated.push("package.json");

  // Update CLAUDE.md
  updateClaudeMd(appName, description);
  generated.push("CLAUDE.md");

  // Update AGENTS.md
  updateAgentsMd(appName, description);
  generated.push("AGENTS.md");

  // Create .env.local
  if (createEnvLocal(appName)) {
    generated.push(".env.local");
  }

  console.log("Files generated:");
  generated.forEach((f) => console.log(`  - ${f}`));
  console.log("\nSetup complete. Run `pnpm dev` to start developing.\n");

  rl.close();
}

function generateProjectBrief(
  appName,
  description,
  inspirationUrls,
  referenceDocs,
) {
  const inspirationSection =
    inspirationUrls.length > 0
      ? inspirationUrls.map((url) => `- ${url}`).join("\n")
      : "_None provided_";

  const docsSection =
    referenceDocs.length > 0
      ? referenceDocs.map((doc) => `- ${doc}`).join("\n")
      : "_None provided_";

  const content = `# ${appName}

${description || "_No description provided_"}

## Inspiration

${inspirationSection}

## Reference Docs

${docsSection}

## Target Users

_TODO: Describe who this app is for_

## Key Features

_TODO: List the core features_

## Tech Decisions

_TODO: Note any specific tech choices beyond the starter defaults_
`;

  fs.writeFileSync(path.join(ROOT, "PROJECT_BRIEF.md"), content);
  console.log("  Created PROJECT_BRIEF.md");
}

function updatePackageJson(appName) {
  const pkgPath = path.join(ROOT, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.log("  Skipped package.json (not found)");
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = appName;
  pkg.version = "0.1.0";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("  Updated package.json");
}

function updateClaudeMd(appName, description) {
  const filePath = path.join(ROOT, "CLAUDE.md");
  if (!fs.existsSync(filePath)) {
    console.log("  Skipped CLAUDE.md (not found)");
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Replace the Template Overview section
  content = content.replace(
    /## Template Overview\n\n\*\*andyd-webapp-starter\*\*[^\n]*\n/,
    `## Project\n\n**${appName}** — ${description || "A Next.js web application."}\n\nSee \`PROJECT_BRIEF.md\` for full project context.\n`,
  );

  // Update the Project Tracking table
  content = content.replace(
    /\| \*\*Category\*\*\s*\|[^\n]*\n/,
    `| **Category**    | Web Application                      |\n`,
  );
  content = content.replace(
    /\| \*\*Status\*\*\s*\|[^\n]*\n/,
    `| **Status**      | Active                               |\n`,
  );
  content = content.replace(
    /\| \*\*Next Action\*\*\s*\|[^\n]*\n/,
    `| **Next Action** | Build initial features               |\n`,
  );

  fs.writeFileSync(filePath, content);
  console.log("  Updated CLAUDE.md");
}

function updateAgentsMd(appName, description) {
  const filePath = path.join(ROOT, "AGENTS.md");
  if (!fs.existsSync(filePath)) {
    console.log("  Skipped AGENTS.md (not found)");
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Replace the Project section
  content = content.replace(
    /## Project\n\n\*\*andyd-webapp-starter\*\*[^\n]*\n/,
    `## Project\n\n**${appName}** — ${description || "A Next.js web application."}\n`,
  );

  fs.writeFileSync(filePath, content);
  console.log("  Updated AGENTS.md");
}

function createEnvLocal(appName) {
  const examplePath = path.join(ROOT, "env.example");
  const envPath = path.join(ROOT, ".env.local");

  if (!fs.existsSync(examplePath)) {
    console.log("  Skipped .env.local (env.example not found)");
    return false;
  }

  if (fs.existsSync(envPath)) {
    console.log("  Skipped .env.local (already exists)");
    return false;
  }

  let envContent = fs.readFileSync(examplePath, "utf8");
  envContent = envContent.replace(
    /NEXT_PUBLIC_APP_NAME=.*/,
    `NEXT_PUBLIC_APP_NAME="${appName}"`,
  );

  fs.writeFileSync(envPath, envContent);
  console.log("  Created .env.local");
  return true;
}

main().catch((err) => {
  console.error("Error:", err.message);
  rl.close();
  process.exit(1);
});
