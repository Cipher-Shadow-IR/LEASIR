# AGENTS.md

## Project Overview

This project should be developed with production-quality standards. AI agents contributing to this repository must prioritize maintainability, readability, scalability, and correctness over quick fixes.

---

## Development Principles

### 1. Understand Before Modifying

* Read relevant files before making changes.
* Understand architecture, data flow, and dependencies.
* Avoid modifying unrelated code.

### 2. Preserve Existing Functionality

* Do not remove features unless explicitly instructed.
* Avoid breaking existing APIs, components, or workflows.
* Maintain backward compatibility whenever possible.

### 3. Code Quality Standards

* Write clean, modular, and reusable code.
* Prefer composition over duplication.
* Follow existing project conventions.
* Use meaningful variable and function names.
* Keep functions focused on a single responsibility.

### 4. Security

* Never expose secrets, API keys, tokens, or credentials.
* Validate all external inputs.
* Follow authentication and authorization best practices.
* Avoid introducing security vulnerabilities.

### 5. Performance

* Avoid unnecessary re-renders.
* Optimize database queries.
* Use efficient algorithms and data structures.
* Minimize network requests where possible.

---

## Frontend Guidelines

### React / Next.js

* Prefer functional components.
* Use hooks appropriately.
* Avoid unnecessary state.
* Use server components where beneficial.
* Maintain responsive design.
* Ensure accessibility standards are respected.

### UI/UX

* Keep interfaces intuitive.
* Preserve design consistency.
* Follow existing component patterns.
* Prioritize usability over visual complexity.

---

## Backend Guidelines

### APIs

* Follow RESTful principles unless otherwise specified.
* Validate request payloads.
* Return meaningful error messages.
* Maintain consistent response structures.

### Database

* Use proper indexing.
* Avoid N+1 query problems.
* Prefer transactions for critical operations.
* Maintain data integrity.

---

## AI Development Guidelines

### LLM Features

* Minimize hallucination risks.
* Use structured prompts.
* Implement proper error handling.
* Log failures and edge cases.

### Agent Workflows

* Design deterministic workflows when possible.
* Validate tool outputs.
* Handle retries gracefully.
* Maintain observability and logging.

---

## Git Practices

### Before Changes

* Understand the task completely.
* Identify affected files.

### During Changes

* Keep commits focused.
* Avoid large unrelated modifications.

### After Changes

* Review modified files.
* Verify functionality.
* Check for regressions.

---

## Documentation

When implementing features:

* Update documentation if behavior changes.
* Add comments only where necessary.
* Document architecture decisions when relevant.

---

## Decision Hierarchy

When conflicts arise, prioritize:

1. Correctness
2. Security
3. Maintainability
4. Performance
5. Developer Convenience

---

## Expected Behavior for AI Agents

AI agents should:

* Think before modifying code.
* Explain major architectural changes.
* Prefer incremental improvements.
* Avoid unnecessary refactors.
* Produce production-ready solutions whenever possible.
