# Agent Philosophies and Workspace Guide

This document outlines the guiding philosophies for AI agents working on this project and explains how to use the `.agents/` directory structure.

## Project Context

*   **Project Type:** ML/AI project
*   **Package Manager:** uv
*   **Development Philosophy:** Minimalism but worked. This is not a product, so we avoid over-design.

## Core Principles

*   **Simplicity:** Prefer simple, straightforward solutions over complex ones.
*   **Pragmatism:** Focus on what works. Functionality is the priority.
*   **Speed:** Iterate quickly. "things perfectly worked" is better than "perfect".
*   **Focus:** Concentrate on the core development tasks. Avoid unnecessary features or abstractions.
*   **Tooling:** Use `uv` for all python package management.
*   **Tests:** Unit tests are necessary for guildrail the development.

## The `.agents/` Directory

**Important:** The `.agents/` directory is intended for AI agents only. Humans will not check this directory unless absolutely necessary. This is your workspace for collaboration, knowledge sharing, and maintaining project continuity across sessions.

### Navigating `.agents/`

When a new agent session starts, follow this reading protocol:

1. **Read `INDEX.md` files first** — Any `INDEX.md` found under `.agents/` (at any level) should be read immediately. These serve as navigation hubs. Apply this rule recursively as you discover subdirectories.
2. **Prioritize landing pages** — Files that look like entry points should be read next: `MAIN.md`, `LANDING.md`, `ONBOARDING.md`, `DOCUMENT.md`, `QUICKSTART.md`, or similar naming patterns.
3. **Defer other files** — For all other files, note their existence but don't read them upfront. Visit them later when they become relevant to your task.

### Directory Structure

#### `.agents/resources/`
**Purpose:** Tutorial materials, code snippets, and reference materials gathered from the internet or other sources.

**Usage:**
- Store code examples, API documentation excerpts, or tutorial content that agents can reference
- Add links to helpful resources with brief descriptions
- Include benchmark code or best practices examples
- Name files descriptively (e.g., `pytorch_dataloader_example.py`, `uv_commands_cheatsheet.md`)

**When to use:** When you find helpful external resources during development that future agents should be aware of.

#### `.agents/plans/`
**Purpose:** Living documentation of features being built and architectural decisions.

**Usage:**
- Document feature specifications and implementation plans
- Track design decisions and alternatives considered
- Update as the project evolves and new features are added
- Include technical specifications and API designs
- Name files by feature or component (e.g., `model_inference_api.md`, `data_pipeline_v2.md`)

**When to use:** When planning new features, refactoring existing code, or making architectural decisions.

#### `.agents/tools/`
**Purpose:** Convenient python scripts for frequently used commands.

**Usage:**
- Each tool should be a standalone python script.
- All tools share a single `uv` environment managed by `pyproject.toml` in this directory.
- To add dependencies, run `uv pip install <package>` inside `.agents/tools/`.
- To run a tool, use `uv run <script_name>` from within the `.agents/tools/` directory.
- An `INDEX.md` file should be maintained to list all available tools with a brief description.
- Avoid complex referencing between tools.

**When to use:** When you find yourself repeating a complex sequence of commands, and it's beneficial to automate it for future agents.

#### `.agents/documents/`
**Purpose:** Essential documentation that future agents should read first. Think of this as the "README for agents."

**Usage:**
- Store high-level project overviews and architecture documentation
- Include onboarding materials for new agent sessions
- Document critical patterns, conventions, and gotchas
- Keep foundational knowledge that doesn't change frequently
- Create an `INDEX.md` to help agents navigate the documents

**When to use:** When you develop understanding about the project that would be valuable for any agent starting fresh on this codebase.

### Best Practices

1. **Write for Future Agents:** Assume the next agent has no context about your session
2. **Be Concise but Complete:** Include enough detail to be actionable
3. **Update Regularly:** Don't wait until the end of a session to document
4. **Use Markdown:** Keep formatting consistent and readable
5. **Cross-Reference:** Link between documents when relevant