# CCDCC (Claude Code Document Content Control)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.12.1+-orange.svg)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A document management framework powered by Claude Code that enables generating multiple document formats from a single source of truth.

## Vision

> **"One content, any format"** - Create content once and generate documents, slides, reports in any format through Claude Code's AI capabilities.

## Core Concept

**Content × Scope × Context = Any Document Format**

- **Content**: Raw information and facts
- **Scope**: Document coverage range and depth  
- **Context**: Target audience, purpose, usage scenario

## Features

### ✅ Implemented
- Basic CLI functionality with Claude Code integration
- Technical writing quality framework (Effectiveness, Efficiency, Satisfaction)
- Interactive command-line interface
- Content linting and quality assessment

### 🚧 In Development
- Project initialization (`ccdcc init`)
- Document generation (`ccdcc gen slides|report|doc`)
- Metadata management system
- Decision tracking and architectural logging

### 🔮 Planned
- Version control integration
- Diagram and chart generation
- Meta-analysis and self-improvement capabilities
- Multi-format output pipeline

## Installation

### Prerequisites
- Node.js 18 or higher
- pnpm package manager

### Install Dependencies
```bash
pnpm install
```

### Build the CLI
```bash
pnpm run build
```

## Usage

### Basic Commands

```bash
# Ask Claude Code a question
ccdcc ask -p "Explain TypeScript interfaces"

# Interactive mode
ccdcc ask -i

# Start interactive session
ccdcc interactive

# Content quality check (planned)
ccdcc lint

# Show help
ccdcc --help
```

### Command Options

#### `ccdcc ask`
- `-p, --prompt <text>` - Prompt text to send to Claude Code
- `-m, --max-turns <number>` - Maximum conversation turns (default: 5)
- `-i, --interactive` - Enable interactive mode

### Examples

```bash
# Direct question
ccdcc ask -p "How to optimize React components?"

# Interactive session with custom turn limit
ccdcc ask -i -m 10

# Quality check content (planned feature)
ccdcc lint content/technical-spec.md
```

## Quality Framework

CCDCC evaluates content across three dimensions:

### 🎯 Effectiveness
- Clear and unambiguous expressions
- Concrete examples and details
- Prevention of misunderstandings
- Factual accuracy

### ⚡ Efficiency
- Logical structure and hierarchy
- Clear navigation paths
- Concise, non-redundant content
- Prioritized information presentation

### 😊 Satisfaction
- Appropriate vocabulary for target audience
- Consistent and polite tone
- Readable presentation format
- Visual organization and clarity

## Development

### Tech Stack

- **Language**: TypeScript with ESM modules
- **Runtime**: Node.js 18+
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Code Quality**: Biome (formatter + linter)

### Dependencies

#### Core
- `@anthropic-ai/claude-code` - Claude Code SDK integration
- `commander` - CLI framework
- `chalk` - Terminal styling
- `inquirer` - Interactive prompts

#### Development
- `vite` - Build tool and bundler
- `typescript` - TypeScript compiler
- `biome` - Code formatting and linting

### Development Commands

```bash
# Start development server with watch mode
pnpm run dev

# Build for production
pnpm run build

# Run the built CLI
pnpm run start
# or directly
node dist/index.js

# Code quality checks
pnpm run check      # Format, lint, and organize imports
pnpm run format     # Format code only
pnpm run lint       # Lint code only
pnpm run typecheck  # Type checking only
```

### Project Structure

```
src/
  index.ts          # Main CLI entry point
dist/
  index.js          # Built executable CLI
vite.config.ts      # Vite build configuration
tsconfig.json       # TypeScript configuration
CLAUDE.md           # Claude Code project instructions
```

### Planned Directory Structure

```
project/
├── .ccdcc/config.yaml          # Project settings
├── content/raw/                # Raw content
├── content/refined/            # Linted content  
├── metadata/scope.yaml         # Scope definitions
├── metadata/context.yaml       # Context definitions
├── decisions/*.log             # Decision history
└── output/slides|reports|docs/ # Generated documents
```

## Roadmap

### 🔥 Highest Priority
- Self-hosting this repository
- Establish Source of Truth methodology
- Automated document generation pipeline

### 🎯 Near Term
- Project initialization workflow
- Multi-format document generation
- Metadata management system
- Content validation and linting

### 🚀 Future Goals
- Version control integration
- Visual content generation
- Decision history tracking
- Meta-analysis and continuous improvement

## Architecture

The project follows an ESM module architecture with:

- **Single Bundle Output**: `dist/index.js` with shebang for direct execution
- **External Dependencies**: CLI dependencies not bundled for smaller size
- **ES2022 Target**: Modern JavaScript features for Node.js 18+
- **Type Safety**: Full TypeScript coverage with strict configuration

## Code Style

CCDCC uses Biome with the following standards:

- **Indentation**: Tabs
- **Quotes**: Double quotes for JavaScript
- **Import Organization**: Automatic sorting and cleanup
- **Node.js Protocol**: Required for builtin modules (`node:path`, `node:fs`)
- **Linting**: Recommended rules with TypeScript support

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes following the code style guidelines
4. Run quality checks: `pnpm run check`
5. Build and test: `pnpm run build && node dist/index.js --help`
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**CCDCC** - Transforming how we create and manage technical documentation through AI-powered content generation.