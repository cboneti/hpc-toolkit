#!/usr/bin/env python3

import argparse
import json
import re
import sys
from pathlib import Path
import hcl2
import yaml

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
    """
    if not MODULE_JS_FILE.exists():
        print(f"Info: '{MODULE_JS_FILE.name}' not found. A new file will be created.")
        return {"core": {}, "community": {}}

    try:
        content = MODULE_JS_FILE.read_text()
        json_match = re.search(
            rf"const\s+{MODULES_VAR_NAME}\s*=\s*({{.*}});", content, re.DOTALL
        )
        if not json_match:
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
    Scans a directory exactly 2 levels deep to find Terraform modules and metadata.
    """
    print(f"Scanning directory: {search_dir} (Depth restricted to Category/Module)")

    discovered_modules = {}

    # 1. Iterate over Category directories
    for category_dir in search_dir.iterdir():
        if not category_dir.is_dir() or category_dir.name.startswith('.'):
            continue

        # 2. Iterate over Module directories
        for module_dir in category_dir.iterdir():
            if not module_dir.is_dir() or module_dir.name.startswith('.'):
                continue

            # 3. Look for ALL .tf files (variables can be split across files)
            # OLD CODE: if p.name in ["variables.tf", "outputs.tf"]
            tf_files = list(module_dir.glob("*.tf"))

            if not tf_files:
                continue

            # Initialize module structure
            module_id = module_dir.name
            parts = module_dir.parts
            category = category_dir.name
            source_prefix = "community" if "community" in parts else "core"

            discovered_modules.setdefault(source_prefix, {})
            discovered_modules[source_prefix].setdefault(category, {})

            # Default Structure
            module_data = {
                "id": module_id,
                "name": format_name(module_id),
                "icon": "📦",
                "inputs": [],
                "outputs": [],
                "inject_module_id": None,
                "has_to_be_used": False
            }

            # Avoid overwriting if we are processing multiple files for same module
            if module_id not in discovered_modules[source_prefix][category]:
                discovered_modules[source_prefix][category][module_id] = module_data
            else:
                module_data = discovered_modules[source_prefix][category][module_id]

            # Parse metadata.yaml
            metadata_path = module_dir / "metadata.yaml"
            if metadata_path.exists():
                try:
                    with metadata_path.open('r', encoding='utf-8') as f:
                        meta_content = yaml.safe_load(f)

                    ghpc = meta_content.get('ghpc', {})
                    if 'inject_module_id' in ghpc:
                        module_data["inject_module_id"] = ghpc['inject_module_id']

                    if 'has_to_be_used' in ghpc:
                        module_data["has_to_be_used"] = ghpc['has_to_be_used']

                except Exception as e:
                    print(f"Warning: Could not parse metadata '{metadata_path}': {e}", file=sys.stderr)

            # Process Terraform Files
            for file_path in tf_files:
                try:
                    with file_path.open('r', encoding='utf-8') as f:
                        content_dict = hcl2.load(f)

                    # Extract Inputs (Variables)
                    if 'variable' in content_dict:
                        for var_block in content_dict['variable']:
                            for var_name, var_details in var_block.items():
                                is_required = 'default' not in var_details
                                # Avoid duplicates if variables are redefined (rare) or scanned twice
                                if not any(i['name'] == var_name for i in module_data["inputs"]):
                                    module_data["inputs"].append({
                                        "name": var_name,
                                        "required": is_required
                                    })

                    # Extract Outputs
                    if 'output' in content_dict:
                        for output_block in content_dict['output']:
                            for output_name in output_block.keys():
                                if output_name not in module_data["outputs"]:
                                    module_data["outputs"].append(output_name)

                except Exception as e:
                    # hcl2 might fail on complex main.tf files, but we only strictly need variables/outputs
                    # If it fails, we just skip that specific file.
                    # print(f"Debug: Skipping file '{file_path}' due to parse error: {e}", file=sys.stderr)
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
                    existing_module = existing_modules_map[module_id]
                    if (existing_module.get("inputs") != module_info["inputs"] or
                        existing_module.get("outputs") != module_info["outputs"] or
                        existing_module.get("inject_module_id") != module_info["inject_module_id"] or
                        existing_module.get("has_to_be_used") != module_info["has_to_be_used"]):

                        existing_module["inputs"] = module_info["inputs"]
                        existing_module["outputs"] = module_info["outputs"]
                        existing_module["inject_module_id"] = module_info["inject_module_id"]
                        existing_module["has_to_be_used"] = module_info["has_to_be_used"]
                        print(f"Updated module: [{source}/{category}/{module_id}]")
                        update_count += 1

    # 4. Write the updated content back to the JS file
    try:
        for source, categories in modules_data.items():
            for category, modules in categories.items():
                modules.sort(key=lambda m: m["id"])
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