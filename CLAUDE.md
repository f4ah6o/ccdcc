# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CCDCC** (Claude Code Document Content Control) - A document management framework powered by Claude Code that enables generating multiple document formats from a single source of truth.

### Vision
"One content, any format" - Create content once and generate documents, slides, reports in any format through Claude Code's AI capabilities.

### Core Concept
**Content × Scope × Context = Any Document Format**

- **Content**: Raw information and facts
- **Scope**: Document coverage range and depth  
- **Context**: Target audience, purpose, usage scenario

### Current Status
Currently implements basic CLI functionality for Claude Code interaction and technical writing quality checks. The full document management framework (init, generate, metadata management) is under development.

## Development Environment

- **Package Manager**: pnpm
- **Build Tool**: Vite (for CLI bundling)
- **Code Formatter/Linter**: Biome
- **Language**: TypeScript with ESM modules
- **Target**: Node.js 18+
- **Version**: 0.0.1

## Dependencies

### Core
- **@anthropic-ai/claude-code**: Claude Code SDK integration
- **commander**: CLI framework for command structure
- **chalk**: Terminal color styling
- **inquirer**: Interactive command-line prompts

### Development
- **vite**: Build tool and bundler
- **typescript**: TypeScript compiler
- **biome**: Code formatting and linting

## Essential Commands

### Development
```bash
# Build the CLI
pnpm run build

# Development with watch mode
pnpm run dev

# Run the CLI after building
node dist/index.js
```

### Code Quality
```bash
# Format, lint, and organize imports
pnpm run check

# Type checking
pnpm run typecheck
```

### Package Management
```bash
# Install dependencies
pnpm install

# Add new dependencies
pnpm add <package>
pnpm add -D <package>  # Dev dependencies
```

## CLI Usage

### Implemented Commands
- `ccdcc lint` - Technical writing quality check
- `ccdcc ask -p "question"` - Ask Claude Code a question
- `ccdcc interactive` - Start interactive session

### Quality Framework
The lint command evaluates content based on three dimensions:

#### Effectiveness (効果性)
- Clear and unambiguous expression
- Concrete examples and details
- Prevention of misunderstandings
- Factual accuracy

#### Efficiency (効率性)
- Logical structure and hierarchy
- Clear navigation
- Concise expression without redundancy
- Prioritization of important information

#### Satisfaction (満足度)
- Vocabulary appropriate for target audience
- Consistent and polite writing style
- Readable presentation
- Visual organization

## Code Style

The project uses Biome with the following configuration:
- **Module System**: ESM (`"type": "module"` in package.json)
- **Import Style**: Node.js protocol required for builtin modules (e.g., `node:path`)
- **Build Target**: Single ESM bundle externalized dependencies

## Architecture

### Current Structure
```
src/
  index.ts          # Main CLI entry point
dist/
  index.js          # Built executable CLI
vite.config.ts      # Vite build configuration
tsconfig.json       # TypeScript configuration
```

### Planned Structure (Roadmap)
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

### High Priority
- Self-hosting of this repository
- Establishment of Source of Truth
- Automatic document generation

### Future Development
- Project initialization (`ccdcc init`)
- Document generation (`ccdcc generate`)
- Metadata management
- Version control integration
- Diagram generation functionality
- Decision history management
- Meta-analysis features

## Special Instructions for AI Assistance

- Focus on the quality framework (Effectiveness, Efficiency, Satisfaction) when reviewing or generating content
- Prioritize self-hosting and Source of Truth establishment
- Maintain ESM module compatibility
- Use pnpm for all package management operations
- Follow the "One content, any format" philosophy when implementing new features
- Consider the Content × Scope × Context equation when designing document generation features