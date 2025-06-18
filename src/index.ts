#!/usr/bin/env node

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";

const program = new Command();

program
	.name("ccdcc")
	.description("Document Content Control CLI using Claude Code")
	.version("0.0.1");

program
	.command("ask")
	.description("Ask Claude Code a question")
	.option("-p, --prompt <text>", "Prompt text to send to Claude")
	.option("-m, --max-turns <number>", "Maximum number of turns", "5")
	.option("-i, --interactive", "Interactive mode")
	.action(async (options) => {
		try {
			let promptText = options.prompt;

			if (options.interactive || !promptText) {
				const answers = await inquirer.prompt([
					{
						type: "input",
						name: "prompt",
						message: "What would you like to ask Claude Code?",
						default: promptText || "",
					},
				]);
				promptText = answers.prompt;
			}

			if (!promptText) {
				console.error(chalk.red("Error: No prompt provided"));
				process.exit(1);
			}

			console.log(chalk.blue("Asking Claude Code..."));
			console.log(chalk.gray(`Prompt: ${promptText}`));
			console.log();

			const messages: SDKMessage[] = [];
			const abortController = new AbortController();

			for await (const message of query({
				prompt: promptText,
				abortController,
				options: {
					maxTurns: Number.parseInt(options.maxTurns),
				},
			})) {
				messages.push(message);
				console.log(chalk.green("Claude:"), JSON.stringify(message, null, 2));
			}
		} catch (error) {
			console.error(
				chalk.red("Error:"),
				error instanceof Error ? error.message : String(error),
			);
			process.exit(1);
		}
	});

function findDocumentFiles(targetPath: string): string[] {
	const supportedExtensions = [".md", ".txt", ".rst"];
	const files: string[] = [];

	try {
		const stat = statSync(targetPath);

		if (stat.isFile()) {
			if (supportedExtensions.includes(extname(targetPath).toLowerCase())) {
				files.push(targetPath);
			}
		} else if (stat.isDirectory()) {
			const entries = readdirSync(targetPath);
			for (const entry of entries) {
				const fullPath = join(targetPath, entry);
				const entryStat = statSync(fullPath);

				if (
					entryStat.isFile() &&
					supportedExtensions.includes(extname(entry).toLowerCase())
				) {
					files.push(fullPath);
				}
			}
		}
	} catch (error) {
		console.error(chalk.red(`Error accessing ${targetPath}:`), error);
	}

	return files;
}

async function lintDocument(
	filePath: string,
	options: { fix?: boolean; output?: string },
): Promise<void> {
	try {
		const content = readFileSync(filePath, "utf-8");
		const filename = basename(filePath);

		console.log(chalk.blue(`\n📄 Analyzing: ${filename}`));
		console.log(chalk.gray(`Path: ${filePath}`));
		console.log(chalk.gray(`Content length: ${content.length} characters`));

		const lintPrompt = `
You are a technical writing expert analyzing documents using a quality framework with three criteria:

**EFFECTIVENESS (効果性)** - Content accuracy and clarity:
- Clear, unambiguous expressions
- Concrete examples and specific details  
- Prevention of misunderstandings
- Factual accuracy

**EFFICIENCY (効率性)** - Information retrieval efficiency:
- Logical structure and hierarchy
- Clear navigation with headings
- Concise expression without redundancy
- Prioritized important information

**SATISFACTION (満足度)** - Readability and user experience:
- Appropriate vocabulary for target audience
- Consistent, polite writing style
- Reader-friendly presentation
- Visual organization

Please analyze this document content and provide:

1. **SCORES** (1-5 for each criterion):
   - Effectiveness: [score]/5
   - Efficiency: [score]/5  
   - Satisfaction: [score]/5

2. **SPECIFIC ISSUES** with examples from the text

3. **IMPROVEMENT SUGGESTIONS** for each criterion

${options.fix ? "4. **IMPROVED VERSION** with fixes applied" : ""}

Document content:
---
${content}
---

Provide analysis in a structured, actionable format.`;

		const messages: SDKMessage[] = [];
		const abortController = new AbortController();

		for await (const message of query({
			prompt: lintPrompt,
			abortController,
			options: {
				maxTurns: 2,
			},
		})) {
			messages.push(message);
			console.log(JSON.stringify(message, null, 2));
		}

		if (options.fix && options.output) {
			const outputDir = options.output;
			await mkdir(outputDir, { recursive: true });

			const outputFilename = `${basename(filePath, extname(filePath))}-tw-reviewed${extname(filePath)}`;
			const outputPath = join(outputDir, outputFilename);

			console.log(chalk.green(`\n✅ Analysis complete. Check results above.`));
			console.log(
				chalk.gray(`Note: Improved version would be saved to ${outputPath}`),
			);
		}
	} catch (error) {
		console.error(chalk.red(`Error analyzing ${filePath}:`), error);
	}
}

program
	.command("lint")
	.description("Lint content for technical writing quality")
	.argument(
		"[file-or-directory]",
		"File or directory to lint (defaults to current directory)",
	)
	.option(
		"-o, --output <path>",
		"Output directory for linted files",
		"./linted",
	)
	.option("--fix", "Automatically fix issues and create improved versions")
	.option(
		"--format <format>",
		"Output format (summary|detailed|json)",
		"summary",
	)
	.action(async (target, options) => {
		try {
			const targetPath = target || process.cwd();

			console.log(chalk.blue("🔍 CCDCC Technical Writing Linter"));
			console.log(chalk.gray(`Target: ${targetPath}`));
			console.log(
				chalk.gray("Framework: Effectiveness × Efficiency × Satisfaction"),
			);
			console.log();

			const files = findDocumentFiles(targetPath);

			if (files.length === 0) {
				console.log(chalk.yellow("No supported document files found."));
				console.log(chalk.gray("Supported extensions: .md, .txt, .rst"));
				return;
			}

			console.log(chalk.green(`Found ${files.length} document(s) to analyze:`));
			for (const file of files) {
				console.log(chalk.gray(`  • ${basename(file)}`));
			}

			for (const file of files) {
				await lintDocument(file, options);
			}

			console.log(chalk.blue("\n📊 Analysis Summary"));
			console.log(chalk.green(`✅ Analyzed ${files.length} document(s)`));

			if (options.fix) {
				console.log(chalk.gray(`Output directory: ${options.output}`));
			}
		} catch (error) {
			console.error(
				chalk.red("Error:"),
				error instanceof Error ? error.message : String(error),
			);
			process.exit(1);
		}
	});

program
	.command("interactive")
	.description("Start interactive session with Claude Code")
	.action(async () => {
		console.log(chalk.blue("Welcome to CCDCC Interactive Mode"));
		console.log(chalk.gray("Type 'exit' or 'quit' to end the session"));
		console.log();

		while (true) {
			try {
				const answers = await inquirer.prompt([
					{
						type: "input",
						name: "prompt",
						message: "Ask Claude:",
					},
				]);

				if (["exit", "quit", "q"].includes(answers.prompt.toLowerCase())) {
					console.log(chalk.blue("Goodbye!"));
					break;
				}

				if (!answers.prompt.trim()) {
					continue;
				}

				console.log(chalk.blue("Claude Code is thinking..."));
				console.log();

				const messages: SDKMessage[] = [];
				const abortController = new AbortController();

				for await (const message of query({
					prompt: answers.prompt,
					abortController,
					options: {
						maxTurns: 3,
					},
				})) {
					messages.push(message);
					console.log(chalk.green("Claude:"), JSON.stringify(message, null, 2));
				}
				console.log();
			} catch (error) {
				console.error(
					chalk.red("Error:"),
					error instanceof Error ? error.message : String(error),
				);
			}
		}
	});

async function generateDocument(
	sourceFile: string,
	format: string,
	options: { scope?: string; context?: string; output?: string },
): Promise<void> {
	try {
		const content = readFileSync(sourceFile, "utf-8");
		const filename = basename(sourceFile);

		console.log(chalk.blue(`\n📝 Generating ${format} from: ${filename}`));
		console.log(chalk.gray(`Source: ${sourceFile}`));
		console.log(chalk.gray(`Scope: ${options.scope || "overview"}`));
		console.log(chalk.gray(`Context: ${options.context || "user"}`));

		let formatPrompt = "";
		let outputExtension = "";

		switch (format.toLowerCase()) {
			case "readme":
				formatPrompt = `
Generate a comprehensive README.md file based on the following content.

Requirements:
- Start with a clear project title and description
- Include installation and usage instructions
- Add sections for features, requirements, and development setup
- Use proper markdown formatting with clear headings
- Include code examples where appropriate
- Add badges and visual elements if relevant
- Target audience: ${options.context || "developers and users"}
- Detail level: ${options.scope || "overview"}

Source content:
---
${content}
---

Generate only the README.md content without explanations.`;
				outputExtension = ".md";
				break;

			case "claude":
			case "claude.md":
				formatPrompt = `
Generate a CLAUDE.md file for Claude Code AI assistant based on the following content.

Requirements:
- Provide clear project overview and context for AI
- Include development environment details and dependencies
- List essential commands for development and usage
- Specify code style and architecture guidelines
- Add any special instructions for AI assistance
- Format as structured markdown with clear sections
- Target: AI assistant understanding of the project
- Detail level: ${options.scope || "detailed"}

Source content:
---
${content}
---

Generate only the CLAUDE.md content without explanations.`;
				outputExtension = ".md";
				break;

			case "slides":
				formatPrompt = `
Generate markdown content for presentation slides based on the following content.

Requirements:
- Structure as slide-friendly sections with clear titles
- Use bullet points and concise statements
- Include speaker notes where helpful
- Focus on key points and visual elements
- Target audience: ${options.context || "general audience"}
- Presentation style: ${options.scope || "overview"}

Source content:
---
${content}
---

Generate slide content in markdown format.`;
				outputExtension = ".md";
				break;

			default:
				throw new Error(`Unsupported format: ${format}`);
		}

		const messages: SDKMessage[] = [];
		const abortController = new AbortController();

		let generatedContent = "";

		for await (const message of query({
			prompt: formatPrompt,
			abortController,
			options: {
				maxTurns: 2,
			},
		})) {
			messages.push(message);
			if (message.type === "result" && !message.is_error) {
				generatedContent = message.result;
			}
		}

		if (!generatedContent) {
			throw new Error("Failed to generate content");
		}

		// Output handling
		let outputPath: string;
		if (options.output) {
			await mkdir(options.output, { recursive: true });
			outputPath = join(options.output, `${format}${outputExtension}`);
		} else {
			outputPath = `${format.toUpperCase()}${outputExtension}`;
		}

		writeFileSync(outputPath, generatedContent, "utf-8");

		console.log(chalk.green(`\n✅ Generated ${format} successfully`));
		console.log(chalk.gray(`Output: ${outputPath}`));
	} catch (error) {
		console.error(chalk.red(`Error generating ${format}:`), error);
		throw error;
	}
}

program
	.command("gen")
	.description("Generate documents from source content")
	.argument("<format>", "Output format (readme|claude|slides|report|doc)")
	.option("-s, --source <file>", "Source content file", "content/raw/project-overview.md")
	.option("--scope <scope>", "Content scope (overview|detailed|reference)", "overview")
	.option("--context <context>", "Target context (user|developer|manager)", "user")
	.option("-o, --output <path>", "Output directory")
	.action(async (format, options) => {
		try {
			console.log(chalk.blue("🚀 CCDCC Document Generator"));
			console.log(chalk.gray(`Format: ${format}`));
			console.log(chalk.gray(`Source: ${options.source}`));
			console.log();

			await generateDocument(options.source, format, options);
		} catch (error) {
			console.error(
				chalk.red("Error:"),
				error instanceof Error ? error.message : String(error),
			);
			process.exit(1);
		}
	});

program.parse();
