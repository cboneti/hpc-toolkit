import os
import pytest
from playwright.sync_api import Page, expect

# Construct path to the HTML file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_PATH = os.path.join(BASE_DIR, "ctk-gui.html")
FIXTURE_PATH = os.path.join(BASE_DIR, "tests", "fixtures", "simple_blueprint.yaml")

def test_page_title(page: Page):
    page.goto(f"file://{HTML_PATH}")
    expect(page).to_have_title("Cluster Toolkit Blueprint Editor")

def test_import_yaml(page: Page):
    page.goto(f"file://{HTML_PATH}")

    # Prepare for file upload
    with page.expect_file_chooser() as fc_info:
        # Click the button that triggers the file input
        # The button has text "Import YAML" and calls document.getElementById('import-file').click()
        page.get_by_text("Import YAML").click()

    file_chooser = fc_info.value
    file_chooser.set_files(FIXTURE_PATH)

    # Check if the YAML output textarea contains the imported content
    # The import logic should update the #yaml-output textarea
    # We might need to wait a bit or check for specific content

    # Note: The current implementation might just populate the canvas and NOT immediately update the text area
    # until "Generate Blueprint YAML" is clicked, OR it might update it immediately.
    # Let's check if the project_id input is updated, as that's part of the vars in our fixture.

    project_id_input = page.locator("#project-id")
    expect(project_id_input).to_have_value("test-project")

    region_input = page.locator("#region")
    expect(region_input).to_have_value("us-central1")

    # Also check if the textarea has some content (optional, depending on implementation)
    # page.get_by_text("Generate Blueprint YAML").click()
    # expect(page.locator("#yaml-output")).to_contain_text("blueprint_name: test-blueprint")
