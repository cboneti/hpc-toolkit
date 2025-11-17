// --- VALUE EDITING LOGIC ---
let editingNodeId = null;
let editingVarName = null;
const valueModal = document.getElementById("value-modal");
const valueInput = document.getElementById("value-modal-input");

// Setup Modal Listeners (Run once on load)
document.getElementById("value-modal-cancel").addEventListener("click", () => {
  valueModal.classList.add("hidden");
});

document.getElementById("value-modal-save").addEventListener("click", () => {
  const val = valueInput.value.trim();
  if (editingNodeId && editingVarName) {
    // Initialize settings object if missing
    if (!blueprintState.nodes[editingNodeId].settings) {
      blueprintState.nodes[editingNodeId].settings = {};
    }

    if (val === "") {
      delete blueprintState.nodes[editingNodeId].settings[editingVarName];
    } else {
      blueprintState.nodes[editingNodeId].settings[editingVarName] = val;
    }

    // Update UI
    renderModuleNode(blueprintState.nodes[editingNodeId]);
    generateBlueprint();
  }
  valueModal.classList.add("hidden");
});

function openValueModal(nodeId, varName) {
  editingNodeId = nodeId;
  editingVarName = varName;
  const currentVal = blueprintState.nodes[nodeId].settings?.[varName] || "";

  document.getElementById(
    "value-modal-title"
  ).textContent = `Set value for '${varName}'`;
  valueInput.value = currentVal;
  valueModal.classList.remove("hidden");
  valueInput.focus();
}

// --- CORE STATE ---
// The MODULES_LIST constant is now loaded from ctk-modules.js

// --- NAME GENERATOR UTILS ---
const adjectives = [
  "swift",
  "cosmic",
  "hyper",
  "grand",
  "silent",
  "blue",
  "rapid",
  "orbit",
  "nova",
  "iron",
];
const nouns = [
  "falcon",
  "eagle",
  "matrix",
  "mesh",
  "grid",
  "voyager",
  "star",
  "nebula",
  "pulse",
  "flow",
];

function generateUniqueName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}-${noun}-${num}`;
}

// Store the generated name globally so it doesn't change on every drag event
let generatedBlueprintName = generateUniqueName();

// Blueprint State Management
let blueprintState = {
  nodes: {}, // { nodeId: { id, name, category, sourcePrefix, x, y, inputs, outputs } }
  connections: [], // [{ sourceNodeId, sourceOutput, targetNodeId, targetInput }]
  customVars: [], // Array to hold user-defined variables: [{ key: 'custom_ip', value: '10.0.0.1' }]
};

// Drag/Connection State
let draggedModule = null; // Used for dropping a new module
let dragData = { isDragging: false, currentId: null, offsetX: 0, offsetY: 0 }; // Used for moving existing nodes
let connectionData = {
  isConnecting: false,
  startNodeId: null,
  startOutput: null,
  startPoint: null,
};

// DOM Elements
const canvasContainer = document.getElementById("blueprint-canvas-container");
const svg = document.getElementById("connection-svg");
const yamlOutput = document.getElementById("yaml-output");
const msgBox = document.getElementById("message-box");

// MODAL REFERENCES
const confirmModal = document.getElementById("confirm-modal");
const modalMessage = document.getElementById("confirm-modal-message");
const modalConfirmBtn = document.getElementById("modal-confirm-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");

// LAYOUT ELEMENTS
const settingsSidebar = document.getElementById("settings-sidebar");
const toggleBtn = document.getElementById("toggle-settings-btn");
const mainLayout = document.getElementById("main-layout");
const settingsContent = document.getElementById("settings-content");
const settingsHeader = document.getElementById("settings-header");

// NEW VARIABLE ELEMENTS
const addVarBtn = document.getElementById("add-var-btn");
const customVarsContainer = document.getElementById("custom-vars-container");

let nodeIdCounter = {};
let settingsPanelCollapsed = false; // Initial state: open

// Lucide Icons for toggling
const iconCollapse = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>`;
const iconExpand = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-right"><path d="m6 3 3 3-3 3"/><path d="m15 12 3 3-3 3"/><path d="m19 12-4 4-4-4"/></svg>`;
const iconChevronDown = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>`;
const iconChevronUp = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m6 15 6-6 6 6"/></svg>`;

// --- MODULE EXPANSION ---
function toggleModuleExpansion(nodeId) {
  const node = blueprintState.nodes[nodeId];
  node.isExpanded = !node.isExpanded;
  renderModuleNode(node);
  renderConnections(); // Redraw connections as node size might change
}

// --- UTILITY FUNCTIONS ---

// Simple UUID generator for nodes
function getNewNodeId(id) {
  nodeIdCounter[id] = (nodeIdCounter[id] || 0) + 1;
  return `${id}-${nodeIdCounter[id]}`;
}

function getConnectionPointPosition(nodeId, type) {
  const nodeEl = document.getElementById(nodeId);
  if (!nodeEl) return { x: 0, y: 0 };

  // Find the specific handle class based on type
  const handleClass = type === "source" ? ".handle-output" : ".handle-input";
  const connEl = nodeEl.querySelector(handleClass);

  if (!connEl) return { x: 0, y: 0 };

  const rect = connEl.getBoundingClientRect();
  const canvasRect = canvasContainer.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2 - canvasRect.left,
    y: rect.top + rect.height / 2 - canvasRect.top,
  };
}

function showMessage(message, type = "warning") {
  msgBox.textContent = message;
  msgBox.className = `mt-3 p-2 rounded-lg text-sm`;
  if (type === "success") {
    msgBox.classList.add("bg-green-100", "text-green-800");
  } else if (type === "error") {
    msgBox.classList.add("bg-red-100", "text-red-800");
  } else {
    msgBox.classList.add("bg-yellow-100", "text-yellow-800");
  }
  msgBox.classList.remove("hidden");
  setTimeout(() => msgBox.classList.add("hidden"), 5000);
}

// Custom confirmation modal implementation (replaces window.confirm)
function showConfirmModal(message, onConfirm) {
  modalMessage.textContent = message;
  confirmModal.classList.remove("hidden");

  // Listener setup using wrapper functions to manage cleanup
  const confirmListener = () => {
    onConfirm(true);
    closeModal();
    modalConfirmBtn.removeEventListener("click", confirmListener);
    modalCancelBtn.removeEventListener("click", cancelListener);
  };
  const cancelListener = () => {
    onConfirm(false);
    closeModal();
    modalConfirmBtn.removeEventListener("click", confirmListener);
    modalCancelBtn.removeEventListener("click", cancelListener);
  };

  modalConfirmBtn.addEventListener("click", confirmListener);
  modalCancelBtn.addEventListener("click", cancelListener);

  function closeModal() {
    confirmModal.classList.add("hidden");
  }
}

// --- VARIABLE MANAGEMENT FUNCTIONS ---

function addVariable() {
  blueprintState.customVars.push({ key: "", value: "" });
  renderCustomVars();
  generateBlueprint();
}

function removeVariable(index) {
  blueprintState.customVars.splice(index, 1);
  renderCustomVars();
  generateBlueprint();
}
function handleVarChange(index, type, event) {
  const rawValue = event.target.value;

  if (type === "key") {
    // 1. Sanitize
    const sanitizedKey = rawValue
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .replace(/^-+|-+$/g, "");

    // 2. Update State
    blueprintState.customVars[index].key = sanitizedKey;

    // 3. Update the DOM input directly (Visual feedback without re-rendering the whole list)
    // We only write back if it changed to avoid cursor jumping issues
    if (event.target.value !== sanitizedKey) {
      event.target.value = sanitizedKey;
    }
  } else {
    // Update State for values
    blueprintState.customVars[index].value = rawValue;
  }

  // REMOVED: renderCustomVars(); <--- This was causing the bug

  // 4. Update the YAML output
  generateBlueprint();
}

function renderCustomVars() {
  customVarsContainer.innerHTML = "";

  blueprintState.customVars.forEach((v, index) => {
    const varDiv = document.createElement("div");
    varDiv.className = "flex space-x-2 mb-2 items-center";

    // Key Input
    const keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.placeholder = "var_name (snake_case)";
    keyInput.value = v.key;
    keyInput.className =
      "w-1/2 p-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono";
    keyInput.addEventListener("input", (e) => handleVarChange(index, "key", e));

    // Value Input
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Value or Reference";
    valueInput.value = v.value;
    valueInput.className =
      "w-1/2 p-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500";
    valueInput.addEventListener("input", (e) =>
      handleVarChange(index, "value", e)
    );

    // Remove Button (SVG 'X')
    const removeBtn = document.createElement("button");
    removeBtn.className = "text-red-500 hover:text-red-700 transition p-1";
    removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    removeBtn.addEventListener("click", () => removeVariable(index));

    varDiv.appendChild(keyInput);
    varDiv.appendChild(valueInput);
    varDiv.appendChild(removeBtn);

    customVarsContainer.appendChild(varDiv);
  });
}

// --- RENDER FUNCTIONS ---
function renderModulePalette() {
  const palette = document.getElementById("module-palette");
  palette.innerHTML = "";

  // Iterate through core and community
  for (const sourcePrefix in MODULES_LIST) {
    const prefixName =
      sourcePrefix === "core" ? "Core Modules" : "Community Modules";

    // 1. Create Source Section Container
    const sourceSection = document.createElement("div");
    sourceSection.className = "mb-4 border-b border-gray-200 pb-2";

    // 2. Create Source Header (Clickable)
    const prefixHeader = document.createElement("div");
    prefixHeader.className =
      "flex items-center justify-between cursor-pointer text-indigo-700 hover:bg-indigo-50 p-2 rounded transition-colors select-none";

    // CHANGED: Start with iconExpand (Collapsed state)
    prefixHeader.innerHTML = `
        <span class="text-base font-bold capitalize">${prefixName}</span>
        <span class="text-indigo-500">${iconExpand}</span>
    `;

    // 3. Create Container for Categories
    const categoriesContainer = document.createElement("div");
    // CHANGED: Added 'hidden' class by default
    categoriesContainer.className = "pl-2 mt-1 hidden";

    // Toggle Logic for Source Prefix
    prefixHeader.addEventListener("click", () => {
      const isHidden = categoriesContainer.classList.toggle("hidden");
      // Update Icon
      const iconSpan = prefixHeader.querySelector("span:last-child");
      // If hidden, show Expand (>), if visible, show Down (v)
      iconSpan.innerHTML = isHidden ? iconExpand : iconChevronDown;
    });

    sourceSection.appendChild(prefixHeader);
    sourceSection.appendChild(categoriesContainer);
    palette.appendChild(sourceSection);

    const categories = MODULES_LIST[sourcePrefix];

    // Iterate through categories (network, compute, storage, etc.)
    for (const category in categories) {
      // 4. Create Category Section
      const categorySection = document.createElement("div");
      categorySection.className = "mb-2";

      // 5. Create Category Header (Clickable)
      const categoryHeader = document.createElement("div");
      categoryHeader.className =
        "flex items-center justify-between cursor-pointer text-gray-600 hover:text-indigo-600 hover:bg-gray-100 p-1.5 rounded transition-colors select-none";

      // CHANGED: Start with iconExpand (Collapsed state)
      categoryHeader.innerHTML = `
        <span class="text-sm font-semibold capitalize">${category.replace(
          /_/g,
          " "
        )}</span>
        <span class="text-gray-400 scale-75">${iconExpand}</span>
      `;

      // 6. Create Container for Modules
      const modulesContainer = document.createElement("div");
      // CHANGED: Added 'hidden' class by default
      modulesContainer.className = "pl-2 mt-1 hidden";

      // Toggle Logic for Category
      categoryHeader.addEventListener("click", () => {
        const isHidden = modulesContainer.classList.toggle("hidden");
        const iconSpan = categoryHeader.querySelector("span:last-child");
        iconSpan.innerHTML = isHidden ? iconExpand : iconChevronDown;
      });

      categorySection.appendChild(categoryHeader);
      categorySection.appendChild(modulesContainer);
      categoriesContainer.appendChild(categorySection);

      // Modules
      categories[category].forEach((module) => {
        const moduleEl = document.createElement("div");
        moduleEl.className =
          "p-2 bg-white border border-gray-300 rounded-md mb-2 shadow-sm text-sm cursor-grab hover:bg-indigo-50 transition duration-100 flex items-center gap-2";
        moduleEl.setAttribute("draggable", true);

        // Add Icon + Name
        moduleEl.innerHTML = `<span class="opacity-75">${module.icon}</span> <span>${module.name}</span>`;

        moduleEl.addEventListener("dragstart", (e) => {
          draggedModule = {
            ...module,
            category: category,
            sourcePrefix: sourcePrefix,
          };
          e.dataTransfer.setData("text/plain", module.id);
        });
        modulesContainer.appendChild(moduleEl);
      });
    }
  }
}

// --- VALIDATION LOGIC ---
function getUnsatisfiedInputs(nodeId) {
  const node = blueprintState.nodes[nodeId];
  if (!node) return [];

  // 1. Base Available Vars
  const availableVars = new Set([
    "project_id",
    "deployment_name",
    "region",
    "zone",
    "labels",
    ...blueprintState.customVars.map((v) => v.key),
  ]);

  // If the metadata says 'name_prefix' is injected, we pretend it's available.
  if (node.inject_module_id) {
    availableVars.add(node.inject_module_id);
  }

  // 2. Add outputs from connected sources
  blueprintState.connections.forEach((conn) => {
    if (conn.targetNodeId === nodeId) {
      const sourceNode = blueprintState.nodes[conn.sourceNodeId];
      if (sourceNode && sourceNode.outputs) {
        sourceNode.outputs.forEach((o) => availableVars.add(o));
      }
    }
  });

  // 3. Check requirements
  // 3. Check requirements
  return node.inputs
    .filter((input) => input.required)
    .filter((input) => {
      // Rule A: Is it available globally or via connection?
      const isAvailable = availableVars.has(input.name);

      // Rule B: NEW - Did the user manually set it in this node's settings?
      const isManuallySet =
        node.settings &&
        node.settings[input.name] !== undefined &&
        node.settings[input.name] !== "";

      // It is unsatisfied if NEITHER A nor B is true
      return !isAvailable && !isManuallySet;
    })
    .map((input) => input.name);
}

function renderModuleNode(node) {
  let nodeEl = document.getElementById(node.id);

  // 1. VALIDATION LOGIC
  const missingInputs = getUnsatisfiedInputs(node.id);
  const mustBeUsed = node.has_to_be_used === true;
  const isUsed = blueprintState.connections.some(
    (conn) => conn.sourceNodeId === node.id
  );
  const usageError = mustBeUsed && !isUsed;
  const hasError = missingInputs.length > 0 || usageError;

  // 2. BUILD ERROR MESSAGE
  let errorMessages = [];
  if (missingInputs.length > 0)
    errorMessages.push(`Missing inputs: ${missingInputs.length}`);
  if (usageError) errorMessages.push("Must be used by another module");
  const statusMessage = errorMessages.join(". ");

  const stateSignature = `${hasError ? "err" : "ok"}-${
    node.isExpanded
  }-${missingInputs.join(",")}-${usageError}`;

  if (!nodeEl) {
    nodeEl = document.createElement("div");
    nodeEl.id = node.id;
    // Drag listener on the main container
    nodeEl.addEventListener("mousedown", (e) => startDrag(e, node.id));
    canvasContainer.appendChild(nodeEl);
  } else {
    if (nodeEl.dataset.state === stateSignature) {
      nodeEl.style.left = `${node.x}px`;
      nodeEl.style.top = `${node.y}px`;
      return;
    }
  }

  nodeEl.dataset.state = stateSignature;

  // 3. VISUAL ELEMENTS
  const statusIcon = hasError
    ? `<span class="text-red-500">⚠️</span>`
    : `<span class="text-green-500">✅</span>`;
  const borderClass = hasError
    ? "border-red-400 shadow-red-100"
    : "border-gray-300";

  const errorBanner = hasError
    ? `<div class="mt-1 p-1 bg-red-50 border border-red-100 rounded text-[10px] text-red-600 font-semibold leading-tight">
             ${statusMessage}
           </div>`
    : "";

  nodeEl.className = `module-node absolute bg-white p-3 rounded-xl shadow-lg border-2 ${borderClass} cursor-move transition-shadow hover:shadow-xl z-10 flex flex-col`;
  // Added flex flex-col and max-height to main card to ensure clean layout
  nodeEl.style.maxHeight = "600px";

  // Input/Output Lists
  const inputListHTML = node.inputs
    .map((i) => {
      const isMissing = missingInputs.includes(i.name);

      // Check if a manual value exists
      const manualValue = node.settings?.[i.name];

      // Styling logic
      let textClass = "text-gray-600";
      let displaySuffix = "";

      if (manualValue) {
        // If set manually: Blue text, show value
        textClass = "text-blue-600 font-medium";
        displaySuffix = `: <span class="text-gray-400 font-mono text-[10px]">${manualValue}</span>`;
      } else if (isMissing) {
        // If missing: Red text
        textClass = "text-red-600 font-bold";
        displaySuffix = "*";
      }

      // Return a clickable div (added onclick)
      // We use a special data attribute or ID to help binding, but inline onclick is easiest here
      return `
            <div class="truncate ${textClass} px-1 cursor-pointer hover:bg-indigo-50 rounded transition-colors"
                 title="Click to set value"
                 onclick="event.stopPropagation(); openValueModal('${node.id}', '${i.name}')">
                ${i.name}${displaySuffix}
            </div>`;
    })
    .join("");

  const outputListHTML = node.outputs
    .map(
      (o) => `<div class="truncate text-gray-600 px-1" title="${o}">${o}</div>`
    )
    .join("");

  nodeEl.innerHTML = `
        <div class="flex justify-between items-center mb-1 pointer-events-none flex-shrink-0">
            <div class="font-bold text-indigo-800 flex items-center gap-2">
                ${node.icon} ${node.name}
                <div class="text-xs">${statusIcon}</div>
            </div>
            <button id="expand-btn-${
              node.id
            }" class="pointer-events-auto text-gray-400 hover:text-indigo-600">
                ${node.isExpanded ? iconChevronUp : iconChevronDown}
            </button>
        </div>

        <div class="text-xs text-gray-500 mb-1 font-mono pointer-events-none truncate flex-shrink-0">${
          node.id
        }</div>

        ${errorBanner}

        <div id="details-${node.id}" class="${
    node.isExpanded ? "" : "hidden"
  } text-xs border-t pt-2 mt-2 overflow-y-auto custom-scrollbar bg-gray-50 rounded border-gray-100 border" style="max-height: 300px;">
            <div class="grid grid-cols-2 gap-2">
               <div class="border-r border-gray-200 pr-1">
                   <span class="font-semibold block mb-1 text-gray-700 sticky top-0 bg-gray-50">Inputs:</span>
                   ${inputListHTML}
               </div>
               <div class="text-right pl-1">
                   <span class="font-semibold block mb-1 text-gray-700 sticky top-0 bg-gray-50">Outputs:</span>
                   ${outputListHTML}
               </div>
            </div>
        </div>

        <div class="node-handle handle-input" title="Connect TO here"></div>
        <div class="node-handle handle-output" title="Drag FROM here"></div>
    `;

  // --- LISTENERS ---

  // 1. Expand/Collapse
  nodeEl
    .querySelector(`#expand-btn-${node.id}`)
    .addEventListener("click", (e) => {
      e.stopPropagation();
      toggleModuleExpansion(node.id);
    });

  // 2. Prevent Dragging when scrolling the list
  const detailsDiv = nodeEl.querySelector(`#details-${node.id}`);
  detailsDiv.addEventListener("mousedown", (e) => e.stopPropagation());

  // 3. Handles
  const outHandle = nodeEl.querySelector(".handle-output");
  outHandle.addEventListener("mousedown", (e) => startConnection(e, node.id));

  const inHandle = nodeEl.querySelector(".handle-input");
  inHandle.addEventListener("mouseup", (e) => endConnection(e, node.id));

  // 4. Delete
  nodeEl.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (confirm(`Delete ${node.name}?`)) removeModule(node.id);
  });

  nodeEl.style.left = `${node.x}px`;
  nodeEl.style.top = `${node.y}px`;
}

function renderConnections() {
  // 1. Clear existing SVG
  const defs = svg.querySelector("defs");
  svg.innerHTML = "";
  svg.appendChild(defs);

  // 2. Draw Connections
  blueprintState.connections.forEach((conn) => {
    const sourceNode = blueprintState.nodes[conn.sourceNodeId];
    const targetNode = blueprintState.nodes[conn.targetNodeId];

    // Safety check
    if (!sourceNode || !targetNode) return;

    const start = getConnectionPointPosition(conn.sourceNodeId, "source");
    const end = getConnectionPointPosition(conn.targetNodeId, "target");

    if ((start.x === 0 && start.y === 0) || (end.x === 0 && end.y === 0))
      return;

    // --- VALIDATION LOGIC: Check for Variable Match ---
    // Does the source provide ANY variable that the destination actually has as an input?
    const hasMatch = sourceNode.outputs.some((outputName) =>
      targetNode.inputs.some((input) => input.name === outputName)
    );

    // Color: Indigo (Valid) vs Red (No Match/Useless)
    const strokeColor = hasMatch ? "#4f46e5" : "#ef4444";

    // Draw Curve
    const dx = Math.abs(start.x - end.x) * 0.5;
    const pathData = `M${start.x},${start.y} C${start.x + dx},${start.y} ${
      end.x - dx
    },${end.y} ${end.x},${end.y}`;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", pathData);
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("stroke-width", "2");
    line.setAttribute("fill", "none");
    line.setAttribute("marker-end", "url(#arrowhead)");

    // Interaction
    line.style.pointerEvents = "stroke";
    line.style.cursor = "pointer";
    line.addEventListener("click", () => removeConnection(conn));

    // Add a tooltip to explain why it's red
    if (!hasMatch) {
      const title = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "title"
      );
      title.textContent = "No matching variables found between these modules.";
      line.appendChild(title);
    }

    svg.appendChild(line);
  });

  // 3. Refresh Node Status (Red/Green)
  Object.values(blueprintState.nodes).forEach((node) => {
    renderModuleNode(node);
  });

  // 4. Draw Active Drag Line
  if (connectionData.isConnecting) {
    const tempLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    tempLine.setAttribute("x1", connectionData.startPoint.x);
    tempLine.setAttribute("y1", connectionData.startPoint.y);
    tempLine.setAttribute("x2", connectionData.currentPoint.x);
    tempLine.setAttribute("y2", connectionData.currentPoint.y);
    tempLine.setAttribute("stroke", "#6366f1");
    tempLine.setAttribute("stroke-dasharray", "5,5");
    tempLine.setAttribute("stroke-width", "2");
    svg.appendChild(tempLine);
  }
}

// --- DRAG & DROP LOGIC (New Nodes) ---

function allowDrop(e) {
  e.preventDefault();
}

function dropNode(e) {
  e.preventDefault();
  const rect = canvasContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (draggedModule) {
    const newNodeId = getNewNodeId(draggedModule.id);
    const newNode = {
      id: newNodeId,
      name: draggedModule.id,
      category: draggedModule.category,
      icon: draggedModule.icon,
      sourcePrefix: draggedModule.sourcePrefix, // NEW: Store core/community
      x: x - 50, // Offset for better centering on cursor
      y: y - 20, // Offset for better centering on cursor
      inputs: draggedModule.inputs,
      outputs: draggedModule.outputs,
      isExpanded: false,
      settings: {}, // Initialize empty settings
      inject_module_id: draggedModule.inject_module_id,
      has_to_be_used: draggedModule.has_to_be_used
    };
    blueprintState.nodes[newNodeId] = newNode;
    renderModuleNode(newNode);
    draggedModule = null; // Clear state
    // Re-render connections just in case
    renderConnections();
    generateBlueprint();
    showMessage(`Module '${newNode.name}' added to blueprint.`, "success");

    // Hide the initial prompt text
    document
      .querySelector("#blueprint-canvas-container p")
      .classList.add("hidden");
  }
}

// --- DRAG LOGIC (Existing Nodes) ---

function startDrag(e, nodeId) {
  // Prevent connection logic from interfering with drag
  if (connectionData.isConnecting) return;

  const nodeEl = document.getElementById(nodeId);
  const rect = nodeEl.getBoundingClientRect();

  dragData.isDragging = true;
  dragData.currentId = nodeId;
  // Calculate offset (where mouse hits the node)
  dragData.offsetX = e.clientX - rect.left;
  dragData.offsetY = e.clientY - rect.top;

  // Update node style to be on top
  nodeEl.style.zIndex = 10;

  // Apply visual feedback
  nodeEl.classList.add("ring-4", "ring-indigo-300", "ring-opacity-50");

  canvasContainer.addEventListener("mousemove", handleDrag);
  canvasContainer.addEventListener("mouseup", endDrag);
}

function handleDrag(e) {
  if (!dragData.isDragging || !dragData.currentId) return;

  const node = blueprintState.nodes[dragData.currentId];
  const canvasRect = canvasContainer.getBoundingClientRect();

  // Calculate new position relative to canvas
  let newX = e.clientX - canvasRect.left - dragData.offsetX;
  let newY = e.clientY - canvasRect.top - dragData.offsetY;

  // console.log({ newX, newY }); // DEBUGGING

  // Clamp to canvas boundaries (optional, but good practice)
  newX = Math.max(0, newX);
  newY = Math.max(0, newY);

  const nodeEl = document.getElementById(dragData.currentId);
  newX = Math.min(newX, canvasRect.width - nodeEl.offsetWidth);
  newY = Math.min(newY, canvasRect.height - nodeEl.offsetHeight);

  // Update state and DOM
  node.x = newX;
  node.y = newY;

  nodeEl.style.left = `${newX}px`;
  nodeEl.style.top = `${newY}px`;

  // Redraw lines immediately
  renderConnections();
}

function endDrag(e) {
  if (dragData.isDragging) {
    const nodeEl = document.getElementById(dragData.currentId);
    nodeEl.style.zIndex = 5; // Reset z-index
    nodeEl.classList.remove("ring-4", "ring-indigo-300", "ring-opacity-50");

    dragData.isDragging = false;
    dragData.currentId = null;

    canvasContainer.removeEventListener("mousemove", handleDrag);
    canvasContainer.removeEventListener("mouseup", endDrag);

    generateBlueprint();
  }
}

// --- CONNECTION LOGIC ---
function startConnection(e, nodeId) {
  e.stopPropagation();

  // Visual start point (Right handle)
  const startPoint = getConnectionPointPosition(nodeId, "source");

  connectionData = {
    isConnecting: true,
    startNodeId: nodeId,
    startPoint: startPoint,
    currentPoint: startPoint,
  };

  canvasContainer.addEventListener("mousemove", updateConnectionLine);
  canvasContainer.addEventListener("mouseup", cancelConnection);
  requestAnimationFrame(animateConnection);
}

function updateConnectionLine(e) {
  if (!connectionData.isConnecting) return;
  const canvasRect = canvasContainer.getBoundingClientRect();

  connectionData.currentPoint = {
    x: e.clientX - canvasRect.left,
    y: e.clientY - canvasRect.top,
  };
}

function animateConnection() {
  if (connectionData.isConnecting) {
    renderConnections();
    requestAnimationFrame(animateConnection);
  }
}

function endConnection(e, targetNodeId) {
  e.stopPropagation();

  // Cleanup listeners
  canvasContainer.removeEventListener("mousemove", updateConnectionLine);
  canvasContainer.removeEventListener("mouseup", cancelConnection);

  if (!connectionData.isConnecting) return;

  // Prevent self-connection
  if (connectionData.startNodeId === targetNodeId) {
    cancelConnection();
    return;
  }

  // Create simple dependency
  const newConnection = {
    sourceNodeId: connectionData.startNodeId,
    targetNodeId: targetNodeId,
  };

  // Check duplicate
  const isDuplicate = blueprintState.connections.some(
    (conn) =>
      conn.sourceNodeId === newConnection.sourceNodeId &&
      conn.targetNodeId === newConnection.targetNodeId
  );

  if (!isDuplicate) {
    blueprintState.connections.push(newConnection);
  }

  connectionData.isConnecting = false;
  renderConnections();
  generateBlueprint();
}

function cancelConnection(e) {
  if (connectionData.isConnecting) {
    document
      .getElementById(connectionData.startNodeId)
      ?.classList.remove("connecting");
    connectionData.isConnecting = false;
    renderConnections();
    canvasContainer.removeEventListener("mousemove", updateConnectionLine);
    canvasContainer.removeEventListener("mouseup", cancelConnection);
  }
}

function removeConnection(conn) {
  const index = blueprintState.connections.findIndex(
    (c) =>
      c.sourceNodeId === conn.sourceNodeId &&
      c.sourceOutput === conn.sourceOutput &&
      c.targetNodeId === conn.targetNodeId &&
      c.targetInput === conn.targetInput
  );

  if (index > -1) {
    blueprintState.connections.splice(index, 1);
    renderConnections();
    generateBlueprint();
    showMessage("Connection removed.", "warning");
  }
}

// --- MODULE DELETION LOGIC ---

function removeModule(nodeId) {
  // 1. Remove node from state
  const nodeToRemove = blueprintState.nodes[nodeId];
  if (!nodeToRemove) return;

  delete blueprintState.nodes[nodeId];

  // 2. Remove associated connections from state
  blueprintState.connections = blueprintState.connections.filter(
    (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
  );

  // 3. Remove node element from DOM
  const nodeEl = document.getElementById(nodeId);
  if (nodeEl) {
    nodeEl.remove();
  }

  // 4. Update UI
  renderConnections();
  generateBlueprint();
  showMessage(`Module '${nodeToRemove.name}' removed.`, "success");

  // If canvas is empty, show prompt again
  if (Object.keys(blueprintState.nodes).length === 0) {
    document
      .querySelector("#blueprint-canvas-container p")
      .classList.remove("hidden");
  }
}

// --- LAYOUT TOGGLE LOGIC ---

function toggleSettingsPanel() {
  settingsPanelCollapsed = !settingsPanelCollapsed;

  if (settingsPanelCollapsed) {
    // Collapse: Change grid to allocate less space to the third column
    mainLayout.classList.remove("grid-cols-[250px_1fr_300px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_40px]");

    // Hide content and adjust sidebar padding/overflow
    settingsSidebar.classList.remove("p-4", "overflow-y-auto");
    settingsSidebar.classList.add("p-1", "overflow-hidden");

    settingsContent.style.display = "none";
    settingsHeader.style.display = "none";

    // Change button icon to Expand
    toggleBtn.innerHTML = iconExpand;
  } else {
    // Expand: Restore grid to original configuration
    mainLayout.classList.remove("grid-cols-[250px_1fr_40px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_300px]");

    // Restore content visibility and sidebar styling
    settingsSidebar.classList.add("p-4", "overflow-y-auto");
    settingsSidebar.classList.remove("p-1", "overflow-hidden");

    settingsContent.style.display = "flex";
    settingsHeader.style.display = "block";

    // Change button icon to Collapse
    toggleBtn.innerHTML = iconCollapse;
  }

  // Force re-render of connections after layout change
  renderConnections();
}

// --- BLUEPRINT GENERATION (Mock YAML) ---
function generateBlueprint() {
  // 1. Get Input Values (or defaults)
  const projectIdInput = document.getElementById("project-id").value;
  const regionInput = document.getElementById("region").value;

  // Use the global generated name
  const depName = generatedBlueprintName;

  // Logic: Default to 'us-west4' if empty, otherwise use input
  const region = regionInput || "us-west4";
  const projectId = projectIdInput || "## Set GCP Project ID Here ##";

  // Logic: specific zone logic (append -c) or default
  const zone = `${region}-c`;

  // 2. Start Construction YAML
  let yaml = `blueprint_name: ${depName}\n\n`;

  yaml += "vars:\n";
  yaml += `  project_id: ${projectId}\n`;
  yaml += `  deployment_name: ${depName}\n`;
  yaml += `  region: ${region}\n`;
  yaml += `  zone: ${zone}\n`;

  // 3. Add Custom User Variables
  blueprintState.customVars.forEach((v) => {
    if (v.key && v.value) {
      yaml += `  ${v.key}: "${v.value}"\n`;
    }
  });

  yaml += "\ndeployment_groups:\n";
  yaml += "- group: primary\n";
  yaml += "  modules:\n";

  // 4. Generate Modules List
  const nodes = Object.values(blueprintState.nodes);

  if (nodes.length === 0) {
    yaml += "    # No modules added yet\n";
  }

  nodes.forEach((node) => {
    const dependencies = new Set();

    // Check connections to build the 'use' list
    blueprintState.connections.forEach((conn) => {
      if (conn.targetNodeId === node.id) {
        dependencies.add(conn.sourceNodeId);
      }
    });

    // Determine source path (core vs community)
    const sourcePathPrefix =
      node.sourcePrefix === "community" ? "community/modules" : "modules";

    // Write Module Block
    yaml += `  - id: ${node.id}\n`;
    yaml += `    source: ${sourcePathPrefix}/${node.category}/${node.name}\n`;

    // Write Dependencies
    if (dependencies.size > 0) {
      yaml += `    use: [${Array.from(dependencies).join(", ")}]\n`;
    }

    // Write Settings
    if (node.settings && Object.keys(node.settings).length > 0) {
      yaml += `    settings:\n`;
      Object.entries(node.settings).forEach(([key, val]) => {
        // Check if value looks like a number or boolean, otherwise quote string
        const isNumber = !isNaN(val) && val.trim() !== "";
        const isBool = val === "true" || val === "false";

        if (isNumber || isBool) {
          yaml += `      ${key}: ${val}\n`;
        } else {
          yaml += `      ${key}: "${val}"\n`;
        }
      });
    }

    yaml += `\n`;
  });

  // 5. Update the Text Area
  yamlOutput.value = yaml;
}

// --- LAYOUT TOGGLE LOGIC ---

function toggleSettingsPanel() {
  settingsPanelCollapsed = !settingsPanelCollapsed;

  if (settingsPanelCollapsed) {
    // Collapse: Change grid to allocate less space to the third column
    mainLayout.classList.remove("grid-cols-[250px_1fr_300px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_40px]");

    // Hide content and adjust sidebar padding/overflow
    settingsSidebar.classList.remove("p-4", "overflow-y-auto");
    settingsSidebar.classList.add("p-1", "overflow-hidden");

    settingsContent.style.display = "none";
    settingsHeader.style.display = "none";

    // Change button icon to Expand
    toggleBtn.innerHTML = iconExpand;
  } else {
    // Expand: Restore grid to original configuration
    mainLayout.classList.remove("grid-cols-[250px_1fr_40px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_300px]");

    // Restore content visibility and sidebar styling
    settingsSidebar.classList.add("p-4", "overflow-y-auto");
    settingsSidebar.classList.remove("p-1", "overflow-hidden");

    settingsContent.style.display = "flex";
    settingsHeader.style.display = "block";

    // Change button icon to Collapse
    toggleBtn.innerHTML = iconCollapse;
  }

  // Force re-render of connections after layout change
  renderConnections();
}

// --- LAYOUT TOGGLE LOGIC ---

function toggleSettingsPanel() {
  settingsPanelCollapsed = !settingsPanelCollapsed;

  if (settingsPanelCollapsed) {
    // Collapse: Change grid to allocate less space to the third column
    mainLayout.classList.remove("grid-cols-[250px_1fr_300px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_40px]");

    // Hide content and adjust sidebar padding/overflow
    settingsSidebar.classList.remove("p-4", "overflow-y-auto");
    settingsSidebar.classList.add("p-1", "overflow-hidden");

    settingsContent.style.display = "none";
    settingsHeader.style.display = "none";

    // Change button icon to Expand
    toggleBtn.innerHTML = iconExpand;
  } else {
    // Expand: Restore grid to original configuration
    mainLayout.classList.remove("grid-cols-[250px_1fr_40px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_300px]");

    // Restore content visibility and sidebar styling
    settingsSidebar.classList.add("p-4", "overflow-y-auto");
    settingsSidebar.classList.remove("p-1", "overflow-hidden");

    settingsContent.style.display = "flex";
    settingsHeader.style.display = "block";

    // Change button icon to Collapse
    toggleBtn.innerHTML = iconCollapse;
  }

  // Force re-render of connections after layout change
  renderConnections();
}

// --- LAYOUT TOGGLE LOGIC ---

function toggleSettingsPanel() {
  settingsPanelCollapsed = !settingsPanelCollapsed;

  if (settingsPanelCollapsed) {
    // Collapse: Change grid to allocate less space to the third column
    mainLayout.classList.remove("grid-cols-[250px_1fr_300px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_40px]");

    // Hide content and adjust sidebar padding/overflow
    settingsSidebar.classList.remove("p-4", "overflow-y-auto");
    settingsSidebar.classList.add("p-1", "overflow-hidden");

    settingsContent.style.display = "none";
    settingsHeader.style.display = "none";

    // Change button icon to Expand
    toggleBtn.innerHTML = iconExpand;
  } else {
    // Expand: Restore grid to original configuration
    mainLayout.classList.remove("grid-cols-[250px_1fr_40px]");
    mainLayout.classList.add("grid-cols-[250px_1fr_300px]");

    // Restore content visibility and sidebar styling
    settingsSidebar.classList.add("p-4", "overflow-y-auto");
    settingsSidebar.classList.remove("p-1", "overflow-hidden");

    settingsContent.style.display = "flex";
    settingsHeader.style.display = "block";

    // Change button icon to Collapse
    toggleBtn.innerHTML = iconCollapse;
  }

  // Force re-render of connections after layout change
  renderConnections();
}
// --- INITIALIZATION ---
// --- INITIALIZATION ---
window.onload = function () {
  // 1. Generate a new unique name on load
  generatedBlueprintName = generateUniqueName();

  // 2. UI Setup
  document.getElementById("confirm-modal").style.display = "none";
  canvasContainer.style.position = "relative";

  // 3. Render Palette
  renderModulePalette();

  // --- SEARCH LISTENER START ---
  const searchInput = document.getElementById('module-search');
  if (searchInput) {
      searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const palette = document.getElementById('module-palette');

        // A. Filter individual modules
        const modules = palette.querySelectorAll('[draggable="true"]');
        modules.forEach(mod => {
          const text = mod.textContent.toLowerCase();
          const isMatch = text.includes(term);
          mod.style.display = isMatch ? 'flex' : 'none';

          if(isMatch && term !== '') {
            mod.classList.add('search-match');
          } else {
            mod.classList.remove('search-match');
          }
        });

        // B. Handle Categories (Open accordions if they contain matches)
        const categoriesContainers = palette.querySelectorAll('.pl-2.mt-1');

        categoriesContainers.forEach(container => {
          // Check if this container has any visible children
          const hasVisibleChildren = Array.from(container.children).some(child => {
             // If it's a module container, check display style
             if (child.style.display !== 'none' && child.tagName !== 'DIV') return false;
             // Check if child has the search-match class or is visible
             if (child.querySelector('.search-match')) return true;
             return child.style.display !== 'none';
          });

          if (term !== "") {
             // If searching and we have results, force expand (remove hidden)
             if (hasVisibleChildren) {
                 container.classList.remove('hidden');
                 // Update chevron icon to "down"
                 const prevHeader = container.previousElementSibling;
                 if(prevHeader) {
                    const iconSpan = prevHeader.querySelector('span:last-child');
                    if(iconSpan) iconSpan.innerHTML = iconChevronDown;
                 }
             } else {
                // Optionally hide empty categories entirely here if desired
             }
          }
        });

        // C. Clean up "Empty" Headers
        // Loops through Category Headers and hides them if they have no visible modules
        const categorySections = palette.querySelectorAll('#module-palette > div > div > div');
        categorySections.forEach(sec => {
            const modContainer = sec.querySelector('div.pl-2');
            if(!modContainer) return;

            // Count visible modules
            const visibleMods = Array.from(modContainer.children).filter(m => m.style.display !== 'none');
            sec.style.display = (visibleMods.length > 0 || term === "") ? 'block' : 'none';
        });
      });
  }
  // --- SEARCH LISTENER END ---

  // 4. Toggle Button Setup
  toggleBtn.innerHTML = iconCollapse;
  toggleBtn.addEventListener("click", toggleSettingsPanel);

  // 5. Event Listeners
  document.getElementById("project-id").addEventListener("input", generateBlueprint);
  document.getElementById("region").addEventListener("input", generateBlueprint);

  // Copy Button
  document.getElementById("generate-yaml-btn").addEventListener("click", () => {
    navigator.clipboard
      .writeText(yamlOutput.value)
      .then(() => showMessage("YAML Blueprint copied!", "success"))
      .catch(() => showMessage("Failed to copy.", "error"));
  });

  // Custom Vars
  addVarBtn.addEventListener("click", addVariable);
  renderCustomVars();

  // Window Resize
  window.addEventListener("resize", () => {
    if (Object.keys(blueprintState.nodes).length > 0) {
      renderConnections();
    }
  });

  // 6. Initial Generation
  generateBlueprint();
};

// --- IMPORT LOGIC ---

// 1. Event Listener for File Input
document
  .getElementById("import-file")
  .addEventListener("change", handleFileImport);

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const data = jsyaml.load(content); // Uses the new library
      loadBlueprintFromData(data);
      event.target.value = ""; // Reset input
    } catch (err) {
      showMessage("Failed to parse YAML file.", "error");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// 2. Main Load Function
function loadBlueprintFromData(data) {
  // Reset State
  blueprintState.nodes = {};
  blueprintState.connections = [];
  blueprintState.customVars = [];
  nodeIdCounter = {};

  // A. Load Variables
  if (data.vars) {
    // Set standard vars to inputs
    if (data.vars.project_id)
      document.getElementById("project-id").value = data.vars.project_id;
    if (data.vars.region)
      document.getElementById("region").value = data.vars.region;

    // Add others to custom vars
    Object.entries(data.vars).forEach(([key, value]) => {
      if (!["project_id", "region", "zone", "deployment_name"].includes(key)) {
        blueprintState.customVars.push({ key, value });
      }
    });
    renderCustomVars();
  }

  // B. Load Modules
  const modules = data.deployment_groups?.[0]?.modules || [];

  // Helper to track hierarchy for auto-layout
  const nodeLevels = {};

  modules.forEach((mod) => {
    // 1. Find the Module Definition in MODULES_LIST based on 'source'
    const def = findModuleDefinition(mod.source);

    if (def) {
      // 2. Create the Node
      blueprintState.nodes[mod.id] = {
        id: mod.id,
        name: def.name, // Visual name from library
        category: def.category,
        icon: def.icon,
        sourcePrefix: def.sourcePrefix,
        inputs: def.inputs,
        outputs: def.outputs,
        x: 0, // Will calculate later
        y: 0,
        isExpanded: false,
        inject_module_id: def.inject_module_id,
        has_to_be_used: def.has_to_be_used,
      };

      // 3. Record Connections
      if (mod.use) {
        mod.use.forEach((sourceId) => {
          // In YAML, 'use' usually points to the Node ID
          blueprintState.connections.push({
            sourceNodeId: sourceId,
            targetNodeId: mod.id,
          });
        });
      }
    } else {
      console.warn(`Could not find module definition for: ${mod.source}`);
    }
  });

  // C. Auto-Layout (Simple Topological Layering)
  performAutoLayout();

  // D. Render
  document
    .getElementById("blueprint-canvas-container")
    .querySelectorAll(".module-node")
    .forEach((el) => el.remove());
  Object.values(blueprintState.nodes).forEach(renderModuleNode);
  renderConnections();
  generateBlueprint(); // Refresh YAML output text

  // Hide "Drag modules here" prompt
  document
    .querySelector("#blueprint-canvas-container p")
    .classList.add("hidden");

  showMessage(`Imported ${modules.length} modules successfully.`, "success");
}

// 3. Helper: Find Module in Library
function findModuleDefinition(sourcePath) {
  // Expected formats:
  // "modules/network/vpc"  -> core
  // "community/modules/scheduler/schedmd..." -> community

  const parts = sourcePath.split("/");
  let sourcePrefix = "core";
  let category = "";
  let moduleId = "";

  if (parts[0] === "community") {
    sourcePrefix = "community";
    // community/modules/<category>/<id>
    category = parts[2];
    moduleId = parts[3];
  } else {
    // modules/<category>/<id>
    category = parts[1];
    moduleId = parts[2];
  }

  if (MODULES_LIST[sourcePrefix] && MODULES_LIST[sourcePrefix][category]) {
    const found = MODULES_LIST[sourcePrefix][category].find(
      (m) => m.id === moduleId
    );
    if (found) {
      return { ...found, sourcePrefix, category };
    }
  }
  return null;
}

// 4. Helper: Auto Layout Algorithm
function performAutoLayout() {
  const nodes = Object.values(blueprintState.nodes);
  const nodeIds = nodes.map((n) => n.id);

  // Initialize levels (X-axis)
  const levels = {};
  nodeIds.forEach((id) => (levels[id] = 0));

  // Simple depth calculation (iterate a few times to propagate depth)
  for (let i = 0; i < nodeIds.length; i++) {
    blueprintState.connections.forEach((conn) => {
      if (
        levels[conn.sourceNodeId] !== undefined &&
        levels[conn.targetNodeId] !== undefined
      ) {
        // Target must be at least 1 level deeper than source
        if (levels[conn.targetNodeId] <= levels[conn.sourceNodeId]) {
          levels[conn.targetNodeId] = levels[conn.sourceNodeId] + 1;
        }
      }
    });
  }

  // Group by level
  const levelGroups = {};
  Object.entries(levels).forEach(([id, level]) => {
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(id);
  });

  // Assign Coordinates
  const startX = 50;
  const startY = 50;
  const xGap = 350; // Width between columns
  const yGap = 150; // Height between rows

  Object.keys(levelGroups).forEach((level) => {
    const group = levelGroups[level];
    group.forEach((nodeId, index) => {
      if (blueprintState.nodes[nodeId]) {
        blueprintState.nodes[nodeId].x = startX + level * xGap;
        blueprintState.nodes[nodeId].y = startY + index * yGap;
      }
    });
  });
}
