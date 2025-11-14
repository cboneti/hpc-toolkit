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
    // Top-Level Header (Core or Community)
    const prefixHeader = document.createElement("h3");
    prefixHeader.className =
      "text-base font-bold mt-4 mb-2 text-indigo-700 capitalize";
    prefixHeader.textContent = prefixName;
    palette.appendChild(prefixHeader);

    const categories = MODULES_LIST[sourcePrefix];

    // Iterate through categories (network, compute, storage, etc.)
    for (const category in categories) {
      // Category Header
      const categoryHeader = document.createElement("h4");
      categoryHeader.className =
        "text-sm font-semibold mt-2 mb-1 text-gray-500 capitalize";
      categoryHeader.textContent = category.replace(/_/g, " "); // Display category nicely
      palette.appendChild(categoryHeader);

      // Modules
      categories[category].forEach((module) => {
        const moduleEl = document.createElement("div");
        moduleEl.className =
          "p-2 bg-white border border-gray-300 rounded-md mb-2 shadow-sm text-sm cursor-grab hover:bg-indigo-50 transition duration-100";
        moduleEl.setAttribute("draggable", true);
        moduleEl.textContent = `${module.icon} ${module.name}`;
        moduleEl.addEventListener("dragstart", (e) => {
          // Attach category and sourcePrefix (core/community) to the drag data
          draggedModule = {
            ...module,
            category: category,
            sourcePrefix: sourcePrefix,
          };
          e.dataTransfer.setData("text/plain", module.id); // Required for drag/drop
        });
        palette.appendChild(moduleEl);
      });
    }
  }
}

// --- VALIDATION LOGIC ---
function getUnsatisfiedInputs(nodeId) {
    const node = blueprintState.nodes[nodeId];
    if (!node) return [];

    // 1. Create a pool of "Available Variables"
    // Start with Global Defaults AND special system variables
    const availableVars = new Set([
        "project_id",
        "deployment_name",
        "region",
        "zone",
        "labels", // <-- ADDED: System automatically handles this
        // Add user-defined custom variables from the sidebar
        ...blueprintState.customVars.map(v => v.key)
    ]);

    // 2. Add outputs from ALL connected source nodes
    blueprintState.connections.forEach(conn => {
        if (conn.targetNodeId === nodeId) {
            const sourceNode = blueprintState.nodes[conn.sourceNodeId];
            if (sourceNode && sourceNode.outputs) {
                sourceNode.outputs.forEach(outputName => {
                    availableVars.add(outputName);
                });
            }
        }
    });

    // 3. Check the node's required inputs against this pool
    const missing = node.inputs
        .filter(input => input.required) // Only care about required inputs
        .filter(input => !availableVars.has(input.name)) // Is it missing from the pool?
        .map(input => input.name);

    return missing;
}

function renderModuleNode(node) {
    let nodeEl = document.getElementById(node.id);

    // 1. Calculate Status
    const missingInputs = getUnsatisfiedInputs(node.id);
    const hasError = missingInputs.length > 0;
    // Create a signature to check if we actually need to re-render HTML
    const stateSignature = `${hasError ? 'err' : 'ok'}-${node.isExpanded}-${missingInputs.join(',')}`;

    if (!nodeEl) {
        // --- INITIAL CREATION ---
        nodeEl = document.createElement("div");
        nodeEl.id = node.id;

        // IMPORTANT: Attach the Drag Listener to the main container once
        nodeEl.addEventListener("mousedown", (e) => startDrag(e, node.id));

        canvasContainer.appendChild(nodeEl);
    } else {
        // --- OPTIMIZATION CHECK ---
        // If the node exists and its state hasn't changed, only update position.
        // This prevents "thrashing" (destroying the handles while you are dragging them).
        if (nodeEl.dataset.state === stateSignature) {
            nodeEl.style.left = `${node.x}px`;
            nodeEl.style.top = `${node.y}px`;
            return;
        }
    }

    // Update the state signature for next time
    nodeEl.dataset.state = stateSignature;

    // --- VISUAL STYLING ---
    const statusIcon = hasError
        ? `<span class="text-red-500" title="Missing inputs: ${missingInputs.join(', ')}">⚠️</span>`
        : `<span class="text-green-500">✅</span>`;

    const borderClass = hasError ? "border-red-400 shadow-red-100" : "border-gray-300";

    nodeEl.className = `module-node absolute bg-white p-3 rounded-xl shadow-lg border-2 ${borderClass} cursor-move transition-shadow hover:shadow-xl z-10`;

    // Generate Lists
    const inputListHTML = node.inputs.map(i => {
        const isMissing = missingInputs.includes(i.name);
        const style = isMissing ? "text-red-600 font-bold" : "text-gray-600";
        const icon = isMissing ? "*" : "";
        return `<div class="truncate ${style}" title="${i.name}">${i.name}${icon}</div>`;
    }).join("");

    const outputListHTML = node.outputs.map(o =>
        `<div class="truncate text-gray-600" title="${o}">${o}</div>`
    ).join("");

    // --- DOM INJECTION ---
    nodeEl.innerHTML = `
        <div class="flex justify-between items-center mb-2 pointer-events-none">
            <div class="font-bold text-indigo-800 flex items-center gap-2">
                ${node.icon} ${node.name}
                <div class="text-xs">${statusIcon}</div>
            </div>
            <button id="expand-btn-${node.id}" class="pointer-events-auto text-gray-400 hover:text-indigo-600">
                ${node.isExpanded ? iconChevronUp : iconChevronDown}
            </button>
        </div>
        <div class="text-xs text-gray-500 mb-2 font-mono pointer-events-none">${node.id}</div>

        <div id="details-${node.id}" class="${node.isExpanded ? '' : 'hidden'} text-xs border-t pt-2 mt-2">
            <div class="grid grid-cols-2 gap-2 pointer-events-none">
               <div><span class="font-semibold">Inputs:</span><div>${inputListHTML}</div></div>
               <div class="text-right"><span class="font-semibold">Outputs:</span><div>${outputListHTML}</div></div>
            </div>
        </div>

        <div class="node-handle handle-input" title="Connect TO here"></div>
        <div class="node-handle handle-output" title="Drag FROM here"></div>
    `;

    // --- RE-ATTACH LISTENERS (Required because innerHTML was replaced) ---

    // 1. Expand Button
    nodeEl.querySelector(`#expand-btn-${node.id}`).addEventListener("click", (e) => {
        e.stopPropagation();
        toggleModuleExpansion(node.id);
    });

    // 2. Connection Handles (CRITICAL: This fixes the broken lines)
    const outHandle = nodeEl.querySelector(".handle-output");
    outHandle.addEventListener("mousedown", (e) => startConnection(e, node.id));

    const inHandle = nodeEl.querySelector(".handle-input");
    inHandle.addEventListener("mouseup", (e) => endConnection(e, node.id));

    // 3. Delete Context Menu
    nodeEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (confirm(`Delete ${node.name}?`)) removeModule(node.id);
    });

    // Update Position
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

        if ((start.x === 0 && start.y === 0) || (end.x === 0 && end.y === 0)) return;

        // --- VALIDATION LOGIC: Check for Variable Match ---
        // Does the source provide ANY variable that the destination actually has as an input?
        const hasMatch = sourceNode.outputs.some(outputName =>
            targetNode.inputs.some(input => input.name === outputName)
        );

        // Color: Indigo (Valid) vs Red (No Match/Useless)
        const strokeColor = hasMatch ? "#4f46e5" : "#ef4444";

        // Draw Curve
        const dx = Math.abs(start.x - end.x) * 0.5;
        const pathData = `M${start.x},${start.y} C${start.x + dx},${start.y} ${end.x - dx},${end.y} ${end.x},${end.y}`;

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
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = "No matching variables found between these modules.";
            line.appendChild(title);
        }

        svg.appendChild(line);
    });

    // 3. Refresh Node Status (Red/Green)
    Object.values(blueprintState.nodes).forEach(node => {
        renderModuleNode(node);
    });

    // 4. Draw Active Drag Line
    if (connectionData.isConnecting) {
        const tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
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
window.onload = function () {
  // 1. Generate a new unique name on load
  generatedBlueprintName = generateUniqueName();

  // 2. UI Setup
  document.getElementById("confirm-modal").style.display = "none";
  canvasContainer.style.position = "relative";

  // 3. Render Palette
  renderModulePalette();

  // 4. Toggle Button Setup
  toggleBtn.innerHTML = iconCollapse;
  toggleBtn.addEventListener("click", toggleSettingsPanel);

  // 5. Event Listeners
  document.getElementById("project-id").addEventListener("input", generateBlueprint);
  document.getElementById("region").addEventListener("input", generateBlueprint);

  // Copy Button
  document.getElementById("generate-yaml-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(yamlOutput.value)
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
// --- INITIALIZATION ---
window.onload = function () {
  // 1. Generate a new unique name on load
  generatedBlueprintName = generateUniqueName();

  // 2. UI Setup
  document.getElementById("confirm-modal").style.display = "none";
  canvasContainer.style.position = "relative";

  // 3. Render Palette
  renderModulePalette();

  // 4. Toggle Button Setup
  toggleBtn.innerHTML = iconCollapse;
  toggleBtn.addEventListener("click", toggleSettingsPanel);

  // 5. Event Listeners
  document
    .getElementById("project-id")
    .addEventListener("input", generateBlueprint);
  document
    .getElementById("region")
    .addEventListener("input", generateBlueprint);

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
