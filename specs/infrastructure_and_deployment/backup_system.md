# Backup System

The `scripts/copy-to-stick.js` script provides a simple but effective way to create redundant copies of the development environment.

## 1. Goal

To create a "stick" (USB or external drive) backup that contains everything needed to resume development on a different machine, without the bloat of build artifacts.

## 2. Source and Destination

- **Sources**:
  - The main `boilerplate` directory.
  - The `deployed` folder (containing all downstream app repos).
  - External documentation files, mostly with keys and credentials (e.g., `docs.rtf`).
- **Destination**: A fixed path defined in the script (e.g., `E:\\sources\\...`).

## 3. Smart Filtering

The script uses a filter function during the copy process to ensure efficiency:

- **Excludes**: `.git`, `.next`, and `node_modules`.
- **Purpose**: This reduces the backup size from gigabytes to megabytes while preserving all source code and configuration.

## 4. Safety Logic

- **Pre-Clean**: The script wipes the destination directory before starting the copy to ensure it doesn't contain stale files from previous backups.
- **Verification**: It checks for the existence of critical source folders (like `boilerplate`) and exits with an error if they are missing.
