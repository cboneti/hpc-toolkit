    // --- CORE STATE ---
    // The MODULES_LIST constant is now loaded from ctk-modules.js

    // Blueprint State Management
    let blueprintState = {
        nodes: {}, // { nodeId: { id, name, category, sourcePrefix, x, y, inputs, outputs } }
        connections: [], // [{ sourceNodeId, sourceOutput, targetNodeId, targetInput }]
        customVars: [] // Array to hold user-defined variables: [{ key: 'custom_ip', value: '10.0.0.1' }]
    };

    // Drag/Connection State
    let draggedModule = null; // Used for dropping a new module
    let dragData = { isDragging: false, currentId: null, offsetX: 0, offsetY: 0 }; // Used for moving existing nodes
    let connectionData = { isConnecting: false, startNodeId: null, startOutput: null, startPoint: null };

    // DOM Elements
    const canvasContainer = document.getElementById('blueprint-canvas-container');
    const svg = document.getElementById('connection-svg');
    const yamlOutput = document.getElementById('yaml-output');
    const msgBox = document.getElementById('message-box');

    // MODAL REFERENCES
    const confirmModal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('confirm-modal-message');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // LAYOUT ELEMENTS
    const settingsSidebar = document.getElementById('settings-sidebar');
    const toggleBtn = document.getElementById('toggle-settings-btn');
    const mainLayout = document.getElementById('main-layout');
    const settingsContent = document.getElementById('settings-content');
    const settingsHeader = document.getElementById('settings-header');

    // NEW VARIABLE ELEMENTS
    const addVarBtn = document.getElementById('add-var-btn');
    const customVarsContainer = document.getElementById('custom-vars-container');

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

    // Get the absolute position of a connection point
    function getConnectionPointPosition(nodeId, type, name) {
        const nodeEl = document.getElementById(nodeId);
        if (!nodeEl) return { x: 0, y: 0 };

        const connEl = nodeEl.querySelector(`[data-type="${type}"][data-name="${name}"]`);
        if (!connEl) return { x: 0, y: 0 };

        const rect = connEl.getBoundingClientRect();
        const canvasRect = canvasContainer.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2 - canvasRect.left,
            y: rect.top + rect.height / 2 - canvasRect.top,
        };
    }

    function showMessage(message, type = 'warning') {
        msgBox.textContent = message;
        msgBox.className = `mt-3 p-2 rounded-lg text-sm`;
        if (type === 'success') {
            msgBox.classList.add('bg-green-100', 'text-green-800');
        } else if (type === 'error') {
            msgBox.classList.add('bg-red-100', 'text-red-800');
        } else {
            msgBox.classList.add('bg-yellow-100', 'text-yellow-800');
        }
        msgBox.classList.remove('hidden');
        setTimeout(() => msgBox.classList.add('hidden'), 5000);
    }

    // Custom confirmation modal implementation (replaces window.confirm)
    function showConfirmModal(message, onConfirm) {
        modalMessage.textContent = message;
        confirmModal.classList.remove('hidden');

        // Listener setup using wrapper functions to manage cleanup
        const confirmListener = () => {
            onConfirm(true);
            closeModal();
            modalConfirmBtn.removeEventListener('click', confirmListener);
            modalCancelBtn.removeEventListener('click', cancelListener);
        };
        const cancelListener = () => {
            onConfirm(false);
            closeModal();
            modalConfirmBtn.removeEventListener('click', confirmListener);
            modalCancelBtn.removeEventListener('click', cancelListener);
        };

        modalConfirmBtn.addEventListener('click', confirmListener);
        modalCancelBtn.addEventListener('click', cancelListener);

        function closeModal() {
            confirmModal.classList.add('hidden');
        }
    }


    // --- VARIABLE MANAGEMENT FUNCTIONS ---

    function addVariable() {
        blueprintState.customVars.push({ key: '', value: '' });
        renderCustomVars();
        generateBlueprint();
    }

    function removeVariable(index) {
        blueprintState.customVars.splice(index, 1);
        renderCustomVars();
        generateBlueprint();
    }

    function handleVarChange(index, type, event) {
        const value = event.target.value;

        if (type === 'key') {
            // Simple sanitization: enforce snake_case
            const sanitizedKey = value.toLowerCase().replace(/[^a-z0-9_]/g, '').replace(/^-+|-+$/g, '');
            blueprintState.customVars[index].key = sanitizedKey;
        } else {
            blueprintState.customVars[index].value = value;
        }

        // Force re-render to reflect key sanitization immediately
        renderCustomVars();
        generateBlueprint();
    }

    function renderCustomVars() {
        customVarsContainer.innerHTML = '';

        blueprintState.customVars.forEach((v, index) => {
            const varDiv = document.createElement('div');
            varDiv.className = 'flex space-x-2 mb-2 items-center';

            // Key Input
            const keyInput = document.createElement('input');
            keyInput.type = 'text';
            keyInput.placeholder = 'var_name (snake_case)';
            keyInput.value = v.key;
            keyInput.className = 'w-1/2 p-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono';
            keyInput.addEventListener('input', (e) => handleVarChange(index, 'key', e));

            // Value Input
            const valueInput = document.createElement('input');
            valueInput.type = 'text';
            valueInput.placeholder = 'Value or Reference';
            valueInput.value = v.value;
            valueInput.className = 'w-1/2 p-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500';
            valueInput.addEventListener('input', (e) => handleVarChange(index, 'value', e));

            // Remove Button (SVG 'X')
            const removeBtn = document.createElement('button');
            removeBtn.className = 'text-red-500 hover:text-red-700 transition p-1';
            removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
            removeBtn.addEventListener('click', () => removeVariable(index));

            varDiv.appendChild(keyInput);
            varDiv.appendChild(valueInput);
            varDiv.appendChild(removeBtn);

            customVarsContainer.appendChild(varDiv);
        });
    }


    // --- RENDER FUNCTIONS ---

    function renderModulePalette() {
        const palette = document.getElementById('module-palette');
        palette.innerHTML = '';

        // Iterate through core and community
        for (const sourcePrefix in MODULES_LIST) {

            const prefixName = sourcePrefix === 'core' ? 'Core Modules' : 'Community Modules';
            // Top-Level Header (Core or Community)
            const prefixHeader = document.createElement('h3');
            prefixHeader.className = 'text-base font-bold mt-4 mb-2 text-indigo-700 capitalize';
            prefixHeader.textContent = prefixName;
            palette.appendChild(prefixHeader);

            const categories = MODULES_LIST[sourcePrefix];

            // Iterate through categories (network, compute, storage, etc.)
            for (const category in categories) {
                // Category Header
                const categoryHeader = document.createElement('h4');
                categoryHeader.className = 'text-sm font-semibold mt-2 mb-1 text-gray-500 capitalize';
                categoryHeader.textContent = category.replace(/_/g, ' '); // Display category nicely
                palette.appendChild(categoryHeader);

                // Modules
                categories[category].forEach(module => {
                    const moduleEl = document.createElement('div');
                    moduleEl.className = 'p-2 bg-white border border-gray-300 rounded-md mb-2 shadow-sm text-sm cursor-grab hover:bg-indigo-50 transition duration-100';
                    moduleEl.setAttribute('draggable', true);
                    moduleEl.textContent = `${module.icon} ${module.name}`;
                    moduleEl.addEventListener('dragstart', (e) => {
                        // Attach category and sourcePrefix (core/community) to the drag data
                        draggedModule = { ...module, category: category, sourcePrefix: sourcePrefix };
                        e.dataTransfer.setData('text/plain', module.id); // Required for drag/drop
                    });
                    palette.appendChild(moduleEl);
                });
            }
        }
    }

    function renderModuleNode(node) {
        let nodeEl = document.getElementById(node.id);
        const isNew = !nodeEl;

        if (isNew) {
            nodeEl = document.createElement('div');
            nodeEl.id = node.id;
            nodeEl.className = 'module-node';

            // Force essential styles via JS to override environmental issues.
            nodeEl.style.position = 'absolute';
            nodeEl.style.backgroundColor = 'white';
            nodeEl.style.border = '2px solid #d1d5db';
            nodeEl.style.padding = '0.75rem';
            nodeEl.style.borderRadius = '0.75rem';
            nodeEl.style.minWidth = '180px';
            nodeEl.style.cursor = 'move';
            nodeEl.style.zIndex = '5';

            nodeEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 700; color: #4338ca;">${node.icon} ${node.name}</div>
                    <button id="expand-btn-${node.id}" class="p-1 text-gray-500 hover:text-indigo-600"></button>
                </div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">${node.category}</div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                    <div id="inputs-${node.id}" style="font-size: 0.75rem; text-align: left;">
                        <span style="font-weight: 600; color: #4b5563;">Inputs:</span>
                    </div>
                    <div id="outputs-${node.id}" style="font-size: 0.75rem; text-align: right;">
                        <span style="font-weight: 600; color: #4b5563;">Outputs:</span>
                    </div>
                </div>
            `;
            canvasContainer.appendChild(nodeEl);

            nodeEl.querySelector(`#expand-btn-${node.id}`).addEventListener('click', () => toggleModuleExpansion(node.id));
            nodeEl.addEventListener('mousedown', (e) => startDrag(e, node.id));
            nodeEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showConfirmModal(`Are you sure you want to remove the module: ${node.name}? This will also delete all associated connections.`, (confirmed) => {
                    if (confirmed) {
                        removeModule(node.id);
                    }
                });
            });
        }

        // Update position
        nodeEl.style.left = `${node.x}px`;
        nodeEl.style.top = `${node.y}px`;

        // Update expand/collapse icon
        const expandBtn = nodeEl.querySelector(`#expand-btn-${node.id}`);
        expandBtn.innerHTML = node.isExpanded ? iconChevronUp : iconChevronDown;

        // Render input/output points
        const inputsEl = document.getElementById(`inputs-${node.id}`);
        const outputsEl = document.getElementById(`outputs-${node.id}`);
        inputsEl.innerHTML = '<span class="font-semibold text-gray-600">Inputs:</span>';
        outputsEl.innerHTML = '<span class="font-semibold text-gray-600">Outputs:</span>';

        const connectedInputs = new Set(
            blueprintState.connections
                .filter(conn => conn.targetNodeId === node.id)
                .map(conn => conn.targetInput)
        );

        const createPoint = (type, name) => {
            const point = document.createElement('div');
            point.className = `conn-point ${type}-point`;
            point.style.top = '1px';
            point.setAttribute('data-node-id', node.id);
            point.setAttribute('data-type', type);
            point.setAttribute('data-name', name);
            point.title = name;
            point.addEventListener('mousedown', (e) => startConnection(e, node.id, type, name));
            point.addEventListener('mouseup', (e) => endConnection(e, node.id, type, name));
            return point;
        };

        let hasVisibleInputs = false;
        if (node.isExpanded) {
            // EXPANDED: Show all inputs
            node.inputs.forEach(input => {
                if (input.name === 'labels') return; // Always hide labels
                const inputLine = document.createElement('div');
                inputLine.className = 'relative mt-1';
                inputLine.textContent = input.name;
                if (input.required) {
                    inputLine.style.fontWeight = 'bold';
                }
                const point = createPoint('input', input.name);
                inputLine.appendChild(point);
                inputsEl.appendChild(inputLine);
                hasVisibleInputs = true;
            });
            outputsEl.style.display = 'block';
            node.outputs.forEach(output => {
                const outputLine = document.createElement('div');
                outputLine.className = 'relative mt-1';
                outputLine.textContent = output;
                const point = createPoint('output', output);
                outputLine.appendChild(point);
                outputsEl.appendChild(outputLine);
            });
        } else {
            // COLLAPSED: Show only required, unsatisfied inputs
            node.inputs.forEach(input => {
                if (input.name !== 'labels' && input.required && !connectedInputs.has(input.name)) {
                    const inputLine = document.createElement('div');
                    inputLine.className = 'relative mt-1';
                    inputLine.textContent = input.name;
                    const point = createPoint('input', input.name);
                    inputLine.appendChild(point);
                    inputsEl.appendChild(inputLine);
                    hasVisibleInputs = true;
                }
            });
            outputsEl.style.display = 'none';
        }

        inputsEl.style.display = hasVisibleInputs ? 'block' : 'none';
        if (node.outputs.length === 0) {
            outputsEl.style.display = 'none';
        }
    }

    function renderConnections() {
        // Clear old connections and redrawing line
        const defs = svg.querySelector('defs');
        svg.innerHTML = '';
        svg.appendChild(defs); // Re-add the defs (containing the marker)

        blueprintState.connections.forEach(conn => {
            const start = getConnectionPointPosition(conn.sourceNodeId, 'output', conn.sourceOutput);
            const end = getConnectionPointPosition(conn.targetNodeId, 'input', conn.targetInput);

            if (start.x === 0 && start.y === 0 || end.x === 0 && end.y === 0) return;

            // Draw a smooth Bezier curve
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            // Calculate control points for a smooth curve
            const dx = Math.abs(start.x - end.x) * 0.5;
            const control1_x = start.x + dx;
            const control1_y = start.y;
            const control2_x = end.x - dx;
            const control2_y = end.y;

            const pathData = `M${start.x},${start.y} C${control1_x},${control1_y} ${control2_x},${control2_y} ${end.x},${end.y}`;

            line.setAttribute('d', pathData);
            line.setAttribute('stroke', '#4f46e5'); // Indigo color
            line.setAttribute('stroke-width', '2');
            line.setAttribute('fill', 'none');
            line.setAttribute('stroke-linecap', 'round');

            // Add Arrowhead Marker for clear direction (left-to-right flow)
            line.setAttribute('marker-end', 'url(#arrowhead)');

            line.setAttribute('data-conn-id', `${conn.sourceNodeId}-${conn.sourceOutput}-${conn.targetNodeId}-${conn.targetInput}`);

            // Allow clicking the line to remove connection (simple implementation)
            line.style.pointerEvents = 'stroke';
            line.classList.add('transition-all', 'duration-200', 'hover:stroke-red-500', 'cursor-pointer');
            line.addEventListener('click', () => removeConnection(conn));

            svg.appendChild(line);
        });

        // Render the temporary connection line
        if (connectionData.isConnecting) {
            const tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tempLine.setAttribute('x1', connectionData.startPoint.x);
            tempLine.setAttribute('y1', connectionData.startPoint.y);
            tempLine.setAttribute('x2', connectionData.currentPoint.x);
            tempLine.setAttribute('y2', connectionData.currentPoint.y);
            tempLine.setAttribute('stroke', '#6366f1');
            tempLine.setAttribute('stroke-dasharray', '5,5');
            tempLine.setAttribute('stroke-width', '2');
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
            showMessage(`Module '${newNode.name}' added to blueprint.`, 'success');

            // Hide the initial prompt text
            document.querySelector('#blueprint-canvas-container p').classList.add('hidden');
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
        nodeEl.classList.add('ring-4', 'ring-indigo-300', 'ring-opacity-50');

        canvasContainer.addEventListener('mousemove', handleDrag);
        canvasContainer.addEventListener('mouseup', endDrag);
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
            nodeEl.classList.remove('ring-4', 'ring-indigo-300', 'ring-opacity-50');

            dragData.isDragging = false;
            dragData.currentId = null;

            canvasContainer.removeEventListener('mousemove', handleDrag);
            canvasContainer.removeEventListener('mouseup', endDrag);

            generateBlueprint();
        }
    }


    // --- CONNECTION LOGIC ---

    function startConnection(e, nodeId, type, name) {
        e.stopPropagation(); // Stop node drag
        if (type !== 'output') {
            showMessage("Connections must start from an OUTPUT port.", 'error');
            return;
        }

        const startPoint = getConnectionPointPosition(nodeId, type, name);

        // Highlight the starting node
        document.getElementById(nodeId).classList.add('connecting');

        connectionData = {
            isConnecting: true,
            startNodeId: nodeId,
            startOutput: name,
            startPoint: startPoint,
            currentPoint: startPoint,
        };

        // Attach mouse move listener to canvas
        canvasContainer.addEventListener('mousemove', updateConnectionLine);
        canvasContainer.addEventListener('mouseup', cancelConnection);

        // Start animation loop to draw the temporary line
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

    function endConnection(e, targetNodeId, targetType, targetName) {
        e.stopPropagation();

        // Cleanup visuals and listeners
        document.getElementById(connectionData.startNodeId)?.classList.remove('connecting');
        canvasContainer.removeEventListener('mousemove', updateConnectionLine);
        canvasContainer.removeEventListener('mouseup', cancelConnection);

        if (!connectionData.isConnecting) return;

        // Check if the connection is valid
        if (targetType !== 'input') {
            showMessage("Connections must end at an INPUT port.", 'error');
            cancelConnection();
            return;
        }

        if (connectionData.startNodeId === targetNodeId) {
            showMessage("Cannot connect a module to itself.", 'error');
            cancelConnection();
            return;
        }

        const newConnection = {
            sourceNodeId: connectionData.startNodeId,
            sourceOutput: connectionData.startOutput,
            targetNodeId: targetNodeId,
            targetInput: targetName,
        };

        // Check for duplicates (same source/target/input/output)
        const isDuplicate = blueprintState.connections.some(conn =>
            conn.sourceNodeId === newConnection.sourceNodeId &&
            conn.sourceOutput === newConnection.sourceOutput &&
            conn.targetNodeId === newConnection.targetNodeId &&
            conn.targetInput === newConnection.targetInput
        );

        if (isDuplicate) {
            showMessage("This connection already exists.", 'warning');
            cancelConnection();
            return;
        }

        // Check for input singularity (an input can only receive one connection)
        const inputIsUsed = blueprintState.connections.some(conn =>
            conn.targetNodeId === newConnection.targetNodeId &&
            conn.targetInput === newConnection.targetInput
        );

        if (inputIsUsed) {
            showMessage(`Input '${targetName}' on module '${blueprintState.nodes[targetNodeId].name}' is already connected. An input can only accept one connection.`, 'error');
            cancelConnection();
            return;
        }

        // Add the new connection
        blueprintState.connections.push(newConnection);
        showMessage(`Connected ${blueprintState.nodes[newConnection.sourceNodeId].name} (${newConnection.sourceOutput}) to ${blueprintState.nodes[newConnection.targetNodeId].name} (${newConnection.targetInput}).`, 'success');

        // Final render and YAML generation
        connectionData.isConnecting = false;
        renderConnections();
        generateBlueprint();
    }

    function cancelConnection(e) {
        if (connectionData.isConnecting) {
            document.getElementById(connectionData.startNodeId)?.classList.remove('connecting');
            connectionData.isConnecting = false;
            renderConnections();
            canvasContainer.removeEventListener('mousemove', updateConnectionLine);
            canvasContainer.removeEventListener('mouseup', cancelConnection);
        }
    }

    function removeConnection(conn) {
        const index = blueprintState.connections.findIndex(c =>
            c.sourceNodeId === conn.sourceNodeId &&
            c.sourceOutput === conn.sourceOutput &&
            c.targetNodeId === conn.targetNodeId &&
            c.targetInput === conn.targetInput
        );

        if (index > -1) {
            blueprintState.connections.splice(index, 1);
            renderConnections();
            generateBlueprint();
            showMessage("Connection removed.", 'warning');
        }
    }

    // --- MODULE DELETION LOGIC ---

    function removeModule(nodeId) {
        // 1. Remove node from state
        const nodeToRemove = blueprintState.nodes[nodeId];
        if (!nodeToRemove) return;

        delete blueprintState.nodes[nodeId];

        // 2. Remove associated connections from state
        blueprintState.connections = blueprintState.connections.filter(conn =>
            conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
        );

        // 3. Remove node element from DOM
        const nodeEl = document.getElementById(nodeId);
        if (nodeEl) {
            nodeEl.remove();
        }

        // 4. Update UI
        renderConnections();
        generateBlueprint();
        showMessage(`Module '${nodeToRemove.name}' removed.`, 'success');

        // If canvas is empty, show prompt again
        if (Object.keys(blueprintState.nodes).length === 0) {
             document.querySelector('#blueprint-canvas-container p').classList.remove('hidden');
        }
    }

    // --- LAYOUT TOGGLE LOGIC ---

    function toggleSettingsPanel() {
        settingsPanelCollapsed = !settingsPanelCollapsed;

        if (settingsPanelCollapsed) {
            // Collapse: Change grid to allocate less space to the third column
            mainLayout.classList.remove('grid-cols-[250px_1fr_300px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_40px]');

            // Hide content and adjust sidebar padding/overflow
            settingsSidebar.classList.remove('p-4', 'overflow-y-auto');
            settingsSidebar.classList.add('p-1', 'overflow-hidden');

            settingsContent.style.display = 'none';
            settingsHeader.style.display = 'none';

            // Change button icon to Expand
            toggleBtn.innerHTML = iconExpand;

        } else {
            // Expand: Restore grid to original configuration
            mainLayout.classList.remove('grid-cols-[250px_1fr_40px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_300px]');

            // Restore content visibility and sidebar styling
            settingsSidebar.classList.add('p-4', 'overflow-y-auto');
            settingsSidebar.classList.remove('p-1', 'overflow-hidden');

            settingsContent.style.display = 'flex';
            settingsHeader.style.display = 'block';

            // Change button icon to Collapse
            toggleBtn.innerHTML = iconCollapse;
        }

        // Force re-render of connections after layout change
        renderConnections();
    }

    // --- INITIALIZATION ---
    window.onload = function() {
        // Force hide the modal on load as a diagnostic step.
        document.getElementById('confirm-modal').style.display = 'none';
        // Force the canvas to have a relative position for absolute children.
        canvasContainer.style.position = 'relative';

        renderModulePalette();

        // Initialize the toggle button icon and add listener
        toggleBtn.innerHTML = iconCollapse;
        toggleBtn.addEventListener('click', toggleSettingsPanel);

        // Event listeners for global vars update
        document.getElementById('project-id').addEventListener('input', generateBlueprint);
        document.getElementById('region').addEventListener('input', generateBlueprint);
        document.getElementById('generate-yaml-btn').addEventListener('click', () => {
             // Simple copy to clipboard function
            navigator.clipboard.writeText(yamlOutput.value).then(() => {
                showMessage("YAML Blueprint copied to clipboard!", 'success');
            }).catch(err => {
                showMessage("Failed to copy text. Please copy manually.", 'error');
            });
        });

        // Initialize custom var listeners
        addVarBtn.addEventListener('click', addVariable);
        renderCustomVars();

        // Initial setup for the canvas to allow redrawing on resize
        window.addEventListener('resize', () => {
            if (Object.keys(blueprintState.nodes).length > 0) {
                renderConnections(); // Redraw connections when window size changes
            }
        });

        generateBlueprint();
    }

    // --- BLUEPRINT GENERATION (Mock YAML) ---

    function generateBlueprint() {
        // 1. Collect all variables
        const vars = {
            project_id: document.getElementById('project-id').value || 'my-project',
            region: document.getElementById('region').value || 'us-central1',
        };
        blueprintState.customVars.forEach(v => {
            if (v.key) {
                if (v.key in vars) {
                    showMessage(`Warning: Custom variable '${v.key}' might overwrite the default value.`, 'warning');
                }
                vars[v.key] = v.value;
            }
        });

        // 2. Generate VARS block
        let yaml = `vars:\n`;
        Object.keys(vars).sort().forEach(key => {
            const value = vars[key];
            let formattedValue;
            if (typeof value === 'string' && !value.startsWith('$') && isNaN(Number(value))) {
                formattedValue = `"${value}"`;
            } else if (value === null || value === undefined || value === "") {
                 formattedValue = 'null';
            } else {
                formattedValue = value;
            }
            yaml += `  ${key}: ${formattedValue}\n`;
        });
        yaml += `\n`;
        yaml += `deployment_groups:\n`;
        yaml += `- group: primary\n`;
        yaml += `  modules:\n`;


        // 3. Generate DEPLOYMENT block
        const nodes = Object.values(blueprintState.nodes);

        nodes.forEach(node => {
            // a. Determine dependencies (use list)
            const dependencies = new Set();
            const settings = {};

            blueprintState.connections.forEach(conn => {
                if (conn.targetNodeId === node.id) {
                    dependencies.add(conn.sourceNodeId);
                    // b. Handle explicit connections (mismatched names)
                    if (conn.sourceOutput !== conn.targetInput) {
                        settings[conn.targetInput] = `${conn.sourceNodeId}.${conn.sourceOutput}`;
                    }
                }
            });

            // c. Generate YAML for the module
            const sourcePathPrefix = node.sourcePrefix === 'community' ? 'community/modules' : 'modules';
            yaml += `  - id: ${node.id}\n`;
            yaml += `    source: ${sourcePathPrefix}/${node.category}/${node.name}\n`;

            if (dependencies.size > 0) {
                yaml += `    use: [${Array.from(dependencies).join(', ')}]\n`;
            }

            if (Object.keys(settings).length > 0) {
                yaml += `    settings:\n`;
                Object.entries(settings).forEach(([key, value]) => {
                    yaml += `      ${key}: ${value}\n`;
                });
            }
            yaml += `\n`;
        });

        yamlOutput.value = yaml;
    }

    // --- LAYOUT TOGGLE LOGIC ---

    function toggleSettingsPanel() {
        settingsPanelCollapsed = !settingsPanelCollapsed;

        if (settingsPanelCollapsed) {
            // Collapse: Change grid to allocate less space to the third column
            mainLayout.classList.remove('grid-cols-[250px_1fr_300px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_40px]');

            // Hide content and adjust sidebar padding/overflow
            settingsSidebar.classList.remove('p-4', 'overflow-y-auto');
            settingsSidebar.classList.add('p-1', 'overflow-hidden');

            settingsContent.style.display = 'none';
            settingsHeader.style.display = 'none';

            // Change button icon to Expand
            toggleBtn.innerHTML = iconExpand;

        } else {
            // Expand: Restore grid to original configuration
            mainLayout.classList.remove('grid-cols-[250px_1fr_40px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_300px]');

            // Restore content visibility and sidebar styling
            settingsSidebar.classList.add('p-4', 'overflow-y-auto');
            settingsSidebar.classList.remove('p-1', 'overflow-hidden');

            settingsContent.style.display = 'flex';
            settingsHeader.style.display = 'block';

            // Change button icon to Collapse
            toggleBtn.innerHTML = iconCollapse;
        }

        // Force re-render of connections after layout change
        renderConnections();
    }

    // --- INITIALIZATION ---
    window.onload = function() {
        // Force hide the modal on load as a diagnostic step.
        document.getElementById('confirm-modal').style.display = 'none';
        // Force the canvas to have a relative position for absolute children.
        canvasContainer.style.position = 'relative';

        renderModulePalette();

        // Initialize the toggle button icon and add listener
        toggleBtn.innerHTML = iconCollapse;
        toggleBtn.addEventListener('click', toggleSettingsPanel);

        // Event listeners for global vars update
        document.getElementById('project-id').addEventListener('input', generateBlueprint);
        document.getElementById('region').addEventListener('input', generateBlueprint);
        document.getElementById('generate-yaml-btn').addEventListener('click', () => {
             // Simple copy to clipboard function
            navigator.clipboard.writeText(yamlOutput.value).then(() => {
                showMessage("YAML Blueprint copied to clipboard!", 'success');
            }).catch(err => {
                showMessage("Failed to copy text. Please copy manually.", 'error');
            });
        });

        // Initialize custom var listeners
        addVarBtn.addEventListener('click', addVariable);
        renderCustomVars();

        // Initial setup for the canvas to allow redrawing on resize
        window.addEventListener('resize', () => {
            if (Object.keys(blueprintState.nodes).length > 0) {
                renderConnections(); // Redraw connections when window size changes
            }
        });

        generateBlueprint();
    }

    // --- LAYOUT TOGGLE LOGIC ---

    function toggleSettingsPanel() {
        settingsPanelCollapsed = !settingsPanelCollapsed;

        if (settingsPanelCollapsed) {
            // Collapse: Change grid to allocate less space to the third column
            mainLayout.classList.remove('grid-cols-[250px_1fr_300px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_40px]');

            // Hide content and adjust sidebar padding/overflow
            settingsSidebar.classList.remove('p-4', 'overflow-y-auto');
            settingsSidebar.classList.add('p-1', 'overflow-hidden');

            settingsContent.style.display = 'none';
            settingsHeader.style.display = 'none';

            // Change button icon to Expand
            toggleBtn.innerHTML = iconExpand;

        } else {
            // Expand: Restore grid to original configuration
            mainLayout.classList.remove('grid-cols-[250px_1fr_40px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_300px]');

            // Restore content visibility and sidebar styling
            settingsSidebar.classList.add('p-4', 'overflow-y-auto');
            settingsSidebar.classList.remove('p-1', 'overflow-hidden');

            settingsContent.style.display = 'flex';
            settingsHeader.style.display = 'block';

            // Change button icon to Collapse
            toggleBtn.innerHTML = iconCollapse;
        }

        // Force re-render of connections after layout change
        renderConnections();
    }

    // --- INITIALIZATION ---
    window.onload = function() {
        // Force hide the modal on load as a diagnostic step.
        document.getElementById('confirm-modal').style.display = 'none';
        // Force the canvas to have a relative position for absolute children.
        canvasContainer.style.position = 'relative';

        renderModulePalette();

        // Initialize the toggle button icon and add listener
        toggleBtn.innerHTML = iconCollapse;
        toggleBtn.addEventListener('click', toggleSettingsPanel);

        // Event listeners for global vars update
        document.getElementById('project-id').addEventListener('input', generateBlueprint);
        document.getElementById('region').addEventListener('input', generateBlueprint);
        document.getElementById('generate-yaml-btn').addEventListener('click', () => {
             // Simple copy to clipboard function
            navigator.clipboard.writeText(yamlOutput.value).then(() => {
                showMessage("YAML Blueprint copied to clipboard!", 'success');
            }).catch(err => {
                showMessage("Failed to copy text. Please copy manually.", 'error');
            });
        });

        // Initialize custom var listeners
        addVarBtn.addEventListener('click', addVariable);
        renderCustomVars();

        // Initial setup for the canvas to allow redrawing on resize
        window.addEventListener('resize', () => {
            if (Object.keys(blueprintState.nodes).length > 0) {
                renderConnections(); // Redraw connections when window size changes
            }
        });

        generateBlueprint();
    }

    // --- LAYOUT TOGGLE LOGIC ---

    function toggleSettingsPanel() {
        settingsPanelCollapsed = !settingsPanelCollapsed;

        if (settingsPanelCollapsed) {
            // Collapse: Change grid to allocate less space to the third column
            mainLayout.classList.remove('grid-cols-[250px_1fr_300px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_40px]');

            // Hide content and adjust sidebar padding/overflow
            settingsSidebar.classList.remove('p-4', 'overflow-y-auto');
            settingsSidebar.classList.add('p-1', 'overflow-hidden');

            settingsContent.style.display = 'none';
            settingsHeader.style.display = 'none';

            // Change button icon to Expand
            toggleBtn.innerHTML = iconExpand;

        } else {
            // Expand: Restore grid to original configuration
            mainLayout.classList.remove('grid-cols-[250px_1fr_40px]');
            mainLayout.classList.add('grid-cols-[250px_1fr_300px]');

            // Restore content visibility and sidebar styling
            settingsSidebar.classList.add('p-4', 'overflow-y-auto');
            settingsSidebar.classList.remove('p-1', 'overflow-hidden');

            settingsContent.style.display = 'flex';
            settingsHeader.style.display = 'block';

            // Change button icon to Collapse
            toggleBtn.innerHTML = iconCollapse;
        }

        // Force re-render of connections after layout change
        renderConnections();
    }

    // --- INITIALIZATION ---
    window.onload = function() {
        // Force hide the modal on load as a diagnostic step.
        document.getElementById('confirm-modal').style.display = 'none';
        // Force the canvas to have a relative position for absolute children.
        canvasContainer.style.position = 'relative';

        renderModulePalette();

        // Initialize the toggle button icon and add listener
        toggleBtn.innerHTML = iconCollapse;
        toggleBtn.addEventListener('click', toggleSettingsPanel);

        // Event listeners for global vars update
        document.getElementById('project-id').addEventListener('input', generateBlueprint);
        document.getElementById('region').addEventListener('input', generateBlueprint);
        document.getElementById('generate-yaml-btn').addEventListener('click', () => {
             // Simple copy to clipboard function
            navigator.clipboard.writeText(yamlOutput.value).then(() => {
                showMessage("YAML Blueprint copied to clipboard!", 'success');
            }).catch(err => {
                showMessage("Failed to copy text. Please copy manually.", 'error');
            });
        });

        // Initialize custom var listeners
        addVarBtn.addEventListener('click', addVariable);
        renderCustomVars();

        // Initial setup for the canvas to allow redrawing on resize
        window.addEventListener('resize', () => {
            if (Object.keys(blueprintState.nodes).length > 0) {
                renderConnections(); // Redraw connections when window size changes
            }
        });

        generateBlueprint();
    }
