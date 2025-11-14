#!/usr/bin/env python3

import argparse
import json
import re
import sys
from pathlib import Path
import hcl2

# --- Configuration ---
# The script assumes it is located in the same directory as the target JS file.
SCRIPT_DIR = Path(__file__).parent.resolve()
MODULE_JS_FILE = SCRIPT_DIR / "ctk-modules.js"
MODULES_VAR_NAME = "MODULES_LIST"

def format_name(name_str: str) -> str:
    """Capitalizes words and replaces hyphens with spaces."""
    return " ".join(word.capitalize() for word in name_str.replace("-", " ").split())

def load_existing_modules() -> dict:
    """
    Loads the module data from the JS file.

    Returns:
        A dictionary with the existing module data, or an empty structure if
        the file doesn't exist or is invalid.
    """
    if not MODULE_JS_FILE.exists():
        print(f"Info: '{MODULE_JS_FILE.name}' not found. A new file will be created.")
        return {"core": {}, "community": {}}

    try:
        content = MODULE_JS_FILE.read_text()
        # Regex to find "const MODULES_LIST = { ... };" and capture the object
        # Made more flexible to handle different whitespace.
        json_match = re.search(
            rf"const\s+{MODULES_VAR_NAME}\s*=\s*({{.*}});", content, re.DOTALL
        )
        if not json_match:
            print(
                f"Warning: Could not find '{MODULES_VAR_NAME}' in '{MODULE_JS_FILE.name}'. "
                "Starting with an empty module set.",
                file=sys.stderr,
            )
            return {"core": {}, "community": {}}

        return json.loads(json_match.group(1))

    except (IOError, json.JSONDecodeError) as e:
        print(
            f"Warning: Could not read or parse '{MODULE_JS_FILE.name}': {e}. "
            "Starting with an empty module set.",
            file=sys.stderr,
        )
        return {"core": {}, "community": {}}

def discover_modules(search_dir: Path) -> dict:
    """
    Scans a directory exactly 2 levels deep to find Terraform modules.
    Structure assumed: search_dir / category / module_id / *.tf

    Args:
        search_dir: The directory to scan (e.g., 'modules' or 'community/modules').

    Returns:
        A dictionary of discovered modules.
    """
    print(f"Scanning directory: {search_dir} (Depth restricted to Category/Module)")

    discovered_modules = {}

    # 1. Iterate over Category directories (e.g., 'compute', 'network')
    for category_dir in search_dir.iterdir():
        if not category_dir.is_dir() or category_dir.name.startswith('.'):
            continue

        # 2. Iterate over Module directories (e.g., 'vm-instance', 'vpc')
        for module_dir in category_dir.iterdir():
            if not module_dir.is_dir() or module_dir.name.startswith('.'):
                continue

            # 3. Look for specific files ONLY in this folder (non-recursive .glob)
            tf_files = [
                p for p in module_dir.glob("*.tf")
                if p.name in ["variables.tf", "outputs.tf"]
            ]

            if not tf_files:
                continue

            # Process the found files
            for file_path in tf_files:
                try:
                    with file_path.open('r', encoding='utf-8') as f:
                        content_dict = hcl2.load(f)

                    parts = file_path.parts

                    # Extract metadata based on path
                    module_id = module_dir.name
                    category = category_dir.name
                    source_prefix = "community" if "community" in parts else "core"

                    # Initialize module structure
                    discovered_modules.setdefault(source_prefix, {})
                    discovered_modules[source_prefix].setdefault(category, {})
                    discovered_modules[source_prefix][category].setdefault(
                        module_id,
                        {
                            "id": module_id,
                            "name": format_name(module_id),
                            "icon": "📦",
                            "inputs": [],
                            "outputs": [],
                        },
                    )

                    if file_path.name == "variables.tf" and 'variable' in content_dict:
                        for var_block in content_dict['variable']:
                            for var_name, var_details in var_block.items():
                                is_required = 'default' not in var_details
                                discovered_modules[source_prefix][category][module_id]["inputs"].append({
                                    "name": var_name,
                                    "required": is_required
                                })

                    elif file_path.name == "outputs.tf" and 'output' in content_dict:
                        for output_block in content_dict['output']:
                            for output_name in output_block.keys():
                                discovered_modules[source_prefix][category][module_id]["outputs"].append(output_name)

                except Exception as e:
                    print(f"Warning: Could not process file '{file_path}': {e}", file=sys.stderr)
                    continue

    return discovered_modules

def main():
    """Main script execution."""
    parser = argparse.ArgumentParser(
        description="Scan a directory for Terraform modules and update a JS file with the findings."
    )
    parser.add_argument(
        "search_dir",
        type=str,
        help="Directory to scan for modules (e.g., 'modules' or 'community/modules').",
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Start from a clean slate, ignoring the existing module file.",
    )
    args = parser.parse_args()

    search_path = Path(args.search_dir)
    if not search_path.is_dir():
        print(f"Error: Directory '{search_path}' not found.", file=sys.stderr)
        sys.exit(1)

    # 1. Load existing data or start fresh if --reset is used
    if args.reset:
        print("Info: --reset flag detected. Starting from an empty module list.")
        modules_data = {"core": {}, "community": {}}
    else:
        modules_data = load_existing_modules()

    # 2. Discover modules from the filesystem
    discovered = discover_modules(search_path)

    # 3. Merge discovered modules into the main data structure
    add_count = 0
    update_count = 0
    for source, categories in discovered.items():
        modules_data.setdefault(source, {})
        for category, modules in categories.items():
            modules_data[source].setdefault(category, [])

            # Create a map of existing modules by ID for efficient updates
            existing_modules_map = {m["id"]: m for m in modules_data[source][category]}

            for module_id, module_info in modules.items():
                # Sort inputs by name and outputs alphabetically
                module_info["inputs"].sort(key=lambda x: x["name"])
                module_info["outputs"].sort()

                if module_id not in existing_modules_map:
                    modules_data[source][category].append(module_info)
                    print(f"Added module: [{source}/{category}/{module_id}]")
                    add_count += 1
                else:
                    # Update existing module's inputs and outputs
                    existing_module = existing_modules_map[module_id]
                    if (existing_module.get("inputs") != module_info["inputs"] or
                        existing_module.get("outputs") != module_info["outputs"]):

                        existing_module["inputs"] = module_info["inputs"]
                        existing_module["outputs"] = module_info["outputs"]
                        print(f"Updated module: [{source}/{category}/{module_id}]")
                        update_count += 1
                    else:
                        print(f"Module already exists and is up-to-date, skipping: [{source}/{category}/{module_id}]")

    # 4. Write the updated content back to the JS file
    try:
        # Sort categories and modules within for deterministic output
        for source, categories in modules_data.items():
            # Sort modules within each category
            for category, modules in categories.items():
                modules.sort(key=lambda m: m["id"])
            # Sort the categories themselves
            modules_data[source] = dict(sorted(categories.items()))

        new_json_str = json.dumps(modules_data, indent=4)
        js_content = f"const {MODULES_VAR_NAME} = {new_json_str};"
        MODULE_JS_FILE.write_text(js_content + "\n")

        print(f"\nSuccessfully added {add_count} new and updated {update_count} existing module(s).")
        print(f"'{MODULE_JS_FILE.name}' has been updated.")

    except IOError as e:
        print(f"Error: Could not write to '{MODULE_JS_FILE.name}': {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()