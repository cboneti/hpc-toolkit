# Cluster Toolkit - Blueprint GUI

This directory contains a web-based GUI for visually building Google Cloud Cluster Toolkit blueprints. It provides a drag-and-drop interface to arrange modules and define dependencies, and it generates the corresponding YAML blueprint in real-time.

## How it Works

The GUI is a single-page application built with HTML, CSS, and vanilla JavaScript. It uses the [Tailwind CSS](https://tailwindcss.com/) framework for styling.

### File Structure

-   `ctk-gui.html`: The main HTML file that defines the structure of the page.
-   `ctk-gui.css`: Contains all custom styles for the application.
-   `ctk-gui.js`: The core application logic, handling all interactivity, state management, and YAML generation.
-   `ctk-modules.js`: A data file that contains the list of all available modules (both `core` and `community`). This file is the source of truth for the module palette.
-   `add-modules.py`: A Python script used to automatically discover and update the list of available modules in `ctk-modules.js`.

## How to Use the GUI

1.  **Open `ctk-gui.html` in a web browser.**
2.  **Drag and Drop:** Drag modules from the **Available Modules** palette on the left onto the central canvas.
3.  **Create Connections:**
    -   Click and hold on an **output** point (on the right side of a module).
    -   Drag the line to an **input** point (on the left side of another module) and release to create a dependency.
    -   The generated YAML will automatically use the output of the source module as the value for the target module's input (e.g., `input_key: $source_module.output_key`).
4.  **Delete Elements:**
    -   **Modules:** Right-click on a module and confirm the deletion.
    -   **Connections:** Simply click on a connection line to remove it.
5.  **Configure and Generate YAML:**
    -   Use the right-hand sidebar to set global variables like `project_id` and `region`.
    -   The **Generated YAML Output** text area shows the blueprint in real-time.
    -   Click the **Generate Blueprint YAML** button to copy the complete YAML to your clipboard.

## Developer Setup

The `add-modules.py` script requires Python 3 and has external dependencies. To manage these, a virtual environment is recommended.

1.  **Create and activate a virtual environment:**
    From the `community/front-end/ctk-gui` directory, run:

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies:**
    Install the required libraries from the `requirements.txt` file:

    ```bash
    pip install -r requirements.txt
    ```

Now you are ready to run the `add-modules.py` script.

## For Developers: Updating the Module List

The list of modules in the palette is sourced from `ctk-modules.js`. You can update this list automatically by running the `add-modules.py` script. This script scans the Cluster Toolkit module directories, parses their inputs (`variables.tf`) and outputs (`outputs.tf`), and updates `ctk-modules.js` with any new modules it finds.

### Running the Script

Ensure you have activated the virtual environment first (`source venv/bin/activate`).

1.  Navigate to this directory (`community/front-end/ctk-gui/`) in your terminal.
2.  Run the script, passing it the path to the top-level module directory you want to scan.

**Example (scanning the `core` modules):**

```bash
python3 add-modules.py ../../../modules
```

**Example (scanning the `community` modules):**

```bash
python3 add-modules.py ../../../community/modules
```

The script will scan the target directory, find any modules not already present in `ctk-modules.js`, and add them.
