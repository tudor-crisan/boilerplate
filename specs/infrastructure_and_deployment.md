# Infrastructure and Deployment

This document explains the project's automation scripts, environment variable management, and deployment workflows.

## 1. Project Initialization
- **`package.json`**: Standardizes dependencies and defines automation shortcuts. See [Scripts](infrastructure_and_deployment/scripts.md) for details.
- **`env/` Folder**: Manages multi-app environment variables. See [Environment Management](infrastructure_and_deployment/environment.md).

## 2. Architecture & Validation
- **`/types`**: Zod-based data schemas. See [Types and Validation](infrastructure_and_deployment/types_and_validation.md).
- **`/lists`**: Auto-generated configuration indexes.

## 3. Automation Workflows
- **Deployment**: Surgical multi-repo publishing via `deploy.js`. See [Deployment Flow](infrastructure_and_deployment/deployment_flow.md).
- **Backup**: Redundant local mirroring via `copy-to-stick.js`. See [Backup System](infrastructure_and_deployment/backup_system.md).

## Detailed Infrastructure Specifications
For more detail on each infrastructure component, see the [Infrastructure and Deployment](infrastructure_and_deployment/) directory.
