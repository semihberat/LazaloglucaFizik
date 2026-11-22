/**
 * Physics Alchemy - Interactive Freeform Canvas Engine
 * Direct Token-on-Token & Token-on-Formula Drag & Drop Fusion
 */

class InteractivePhysicsCanvas {
  constructor() {
    this.canvas = document.getElementById('physicsCanvas');
    this.svgLayer = document.getElementById('canvasSvgLayer');
    this.nodesContainer = document.getElementById('canvasNodesContainer');
    this.hudPill = document.getElementById('canvasHudPill');
    this.emptyState = document.getElementById('canvasEmptyState');

    this.nodes = new Map(); // id -> { id, type: 'quantity'|'formula', data, x, y, el }
    this.draggedNode = null;
    this.hoverTargetNode = null;
    this.activeSvgLine = null;
    this.nextInstanceId = 1;

    this.initCanvasEvents();
  }

  initCanvasEvents() {
    if (!this.canvas) return;

    // Native Drag & Drop from Sidebar into Canvas
    this.canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      
      // Check if mouse is hovering over an existing node
      const targetEl = e.target.closest('.canvas-node');
      if (targetEl) {
        const targetId = targetEl.dataset.nodeId;
        const targetNode = this.nodes.get(targetId);
        if (targetNode) {
          const draggedSidebarId = window.appState ? window.appState.draggedSidebarQuantityId : null;
          if (draggedSidebarId) {
            const draggedQty = PHYSICS_DATA.quantities.find(q => q.id === draggedSidebarId);
            if (draggedQty) {
              const reaction = PHYSICS_DATA.findReaction(targetNode.data, draggedQty);
              this.showHudPreview(targetNode.x, targetNode.y, draggedQty, targetNode.data, reaction);
              targetEl.classList.add('snap-hover');
            }
          }
        }
      } else {
        this.hideHudPreview();
        document.querySelectorAll('.canvas-node.snap-hover').forEach(el => el.classList.remove('snap-hover'));
      }
    });

    this.canvas.addEventListener('dragleave', (e) => {
      if (!this.canvas.contains(e.relatedTarget)) {
        this.hideHudPreview();
        document.querySelectorAll('.canvas-node.snap-hover').forEach(el => el.classList.remove('snap-hover'));
      }
    });

    this.canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      this.hideHudPreview();
      document.querySelectorAll('.canvas-node.snap-hover').forEach(el => el.classList.remove('snap-hover'));

      const quantityId = e.dataTransfer.getData('text/plain') || (window.appState ? window.appState.draggedSidebarQuantityId : null);
      if (!quantityId) return;

      const quantity = PHYSICS_DATA.quantities.find(q => q.id === quantityId);
      if (!quantity) return;

      const rect = this.canvas.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;

      // Check if dropped directly onto an existing node
      const targetEl = e.target.closest('.canvas-node');
      if (targetEl) {
        const targetId = targetEl.dataset.nodeId;
        const targetNode = this.nodes.get(targetId);
        if (targetNode) {
          this.attemptFusion(targetNode, { type: 'quantity', data: quantity });
          return;
        }
      }

      // Check proximity to any node within 75px
      const nearbyNode = this.findNearbyNode(dropX, dropY, 80);
      if (nearbyNode) {
        this.attemptFusion(nearbyNode, { type: 'quantity', data: quantity });
        return;
      }

      // Otherwise spawn a new token at cursor position
      this.spawnQuantityNode(quantity, dropX, dropY);
      window.soundManager.playPop();
    });

    // Global Pointer Movement for canvas node dragging
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));

    // Clear Canvas Button
    const clearBtn = document.getElementById('clearCanvasBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAll());
    }

    // Demo Preset Button
    const demoBtn = document.getElementById('presetDemoBtn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => this.spawnDemoPair());
    }
  }

  updateEmptyState() {
    if (!this.emptyState) return;
    if (this.nodes.size === 0) {
      this.emptyState.classList.remove('hidden');
    } else {
      this.emptyState.classList.add('hidden');
    }
  }

  clearAll() {
    this.nodes.forEach(node => node.el.remove());
    this.nodes.clear();
    this.clearSvgLine();
    this.hideHudPreview();
    this.updateEmptyState();
    window.soundManager.playPop();
  }

  spawnDemoPair() {
    this.clearAll();
    const rect = this.canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const mass = PHYSICS_DATA.quantities.find(q => q.id === 'mass');
    const accel = PHYSICS_DATA.quantities.find(q => q.id === 'gravity_accel') || PHYSICS_DATA.quantities.find(q => q.id === 'distance');

    if (mass) this.spawnQuantityNode(mass, cx - 120, cy);
    if (accel) this.spawnQuantityNode(accel, cx + 120, cy);

    window.soundManager.playPop();
  }

  /**
   * Spawn a Physical Quantity Token
   */
  spawnQuantityNode(quantity, x, y) {
    const instanceId = 'node_' + (this.nextInstanceId++);
    const el = document.createElement('div');
    el.className = 'canvas-node quantity-token';
    el.dataset.nodeId = instanceId;

    const isScalar = quantity.type === 'scalar';
    const isConstant = quantity.type === 'constant';
    const typeClass = isScalar ? 'token-scalar' : (isConstant ? 'token-constant' : 'token-vector');
    const typeLabel = isScalar ? 'Skaler' : (isConstant ? 'Sabit' : 'Vektör');

    el.classList.add(typeClass);

    el.innerHTML = `
      <div class="token-header">
        <span class="token-type-pill">${typeLabel}</span>
        <button class="token-close-btn" title="Kaldır">✕</button>
      </div>
      <div class="token-body">
        <span class="token-symbol font-serif">${quantity.symbol}</span>
        <span class="token-name">${quantity.name}</span>
        <span class="token-unit font-mono">${quantity.unit}</span>
      </div>
      <div class="token-footer">
        <span class="token-dim font-mono">${quantity.dimension}</span>
        <button class="token-wiki-btn" title="Vikipedi Bilgisi">
          <i data-lucide="info" class="w-3 h-3"></i>
        </button>
      </div>
    `;

    // Position node centered at (x, y)
    el.style.left = `${Math.max(20, Math.min(this.canvas.clientWidth - 140, x - 65))}px`;
    el.style.top = `${Math.max(20, Math.min(this.canvas.clientHeight - 130, y - 60))}px`;

    this.nodesContainer.appendChild(el);
    lucide.createIcons({ root: el });

    const nodeObj = {
      id: instanceId,
      type: 'quantity',
      data: quantity,
      x: parseInt(el.style.left) + 65,
      y: parseInt(el.style.top) + 60,
      el: el
    };

    this.nodes.set(instanceId, nodeObj);
    this.attachNodeInteraction(nodeObj);
    this.updateEmptyState();

    // Spawn entrance animation
    el.classList.add('node-enter');
    setTimeout(() => el.classList.remove('node-enter'), 400);

    return nodeObj;
  }

  /**
   * Spawn a Merged Formula Node
   */
  spawnFormulaNode(formula, x, y) {
    const instanceId = 'formula_' + (this.nextInstanceId++);
    const el = document.createElement('div');
    el.className = 'canvas-node formula-node';
    el.dataset.nodeId = instanceId;

    el.innerHTML = `
      <div class="formula-node-header">
        <span class="formula-badge-category">${formula.category}</span>
        <div class="flex items-center gap-1">
          <button class="formula-action-btn formula-decompose-btn" title="Bileşenlerine Ayrıştır">⤢</button>
          <button class="token-close-btn" title="Kaldır">✕</button>
        </div>
      </div>

      <div class="formula-node-body">
        <h4 class="formula-node-title">${formula.title}</h4>
        <div class="formula-katex-display font-serif"></div>
        <p class="formula-node-desc">${formula.description}</p>
        <span class="formula-dim-badge font-mono">${formula.badge}</span>
      </div>

      <div class="formula-node-footer">
        <button class="formula-pill-btn formula-wiki-btn">
          <i data-lucide="globe" class="w-3 h-3 text-cyan-400"></i>
          <span>Vikipedi</span>
        </button>
        <button class="formula-pill-btn formula-ai-btn" title="LazalBot Fizik Sezgisi (Canlı AI)">
          <i data-lucide="sparkles" class="w-3 h-3 text-purple-400"></i>
          <span>Fizik Sezgisi</span>
        </button>
      </div>
    `;

    // Render KaTeX via centralized math renderer
    const katexContainer = el.querySelector('.formula-katex-display');
    if (katexContainer) {
      if (typeof window.renderMath === 'function') {
        window.renderMath(katexContainer, formula.katex, true);
      } else if (window.katex) {
        katex.render(formula.katex, katexContainer, { displayMode: true, throwOnError: false });
      }
    }

    // Position node centered at (x, y)
    el.style.left = `${Math.max(20, Math.min(this.canvas.clientWidth - 260, x - 120))}px`;
    el.style.top = `${Math.max(20, Math.min(this.canvas.clientHeight - 190, y - 90))}px`;

    this.nodesContainer.appendChild(el);
    lucide.createIcons({ root: el });

    const nodeObj = {
      id: instanceId,
      type: 'formula',
      data: formula,
      x: parseInt(el.style.left) + 120,
      y: parseInt(el.style.top) + 90,
      el: el
    };

    this.nodes.set(instanceId, nodeObj);
    this.attachNodeInteraction(nodeObj);
    this.updateEmptyState();

    // Actions
    el.querySelector('.formula-wiki-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.wikiModalManager) {
        window.wikiModalManager.openFor(formula.wikiQuery, formula.title);
      }
    });

    el.querySelector('.formula-ai-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.appState) {
        window.appState.openAiDrawer();
      }
      if (window.aiAssistant) {
        window.aiAssistant.explainFormulaDeeply(formula);
      }
    });

    el.querySelector('.formula-decompose-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.decomposeFormula(nodeObj);
    });

    // Spawn entrance ripple
    el.classList.add('node-enter');
    setTimeout(() => el.classList.remove('node-enter'), 400);

    return nodeObj;
  }

  attachNodeInteraction(nodeObj) {
    const el = nodeObj.el;

    // Remove button
    const closeBtn = el.querySelector('.token-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeNode(nodeObj.id);
        window.soundManager.playPop();
      });
    }

    // Wiki quick info for tokens
    const wikiBtn = el.querySelector('.token-wiki-btn');
    if (wikiBtn) {
      wikiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.wikiModalManager) {
          window.wikiModalManager.openFor(nodeObj.data.wikiQuery, nodeObj.data.name);
        }
      });
    }

    // Pointer Drag Handling
    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return; // Ignore if clicked on a button
      e.preventDefault();
      
      this.draggedNode = nodeObj;
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);

      const rect = el.getBoundingClientRect();
      this.dragOffsetX = e.clientX - rect.left;
      this.dragOffsetY = e.clientY - rect.top;

      window.soundManager.playPop();
    });
  }

  onPointerMove(e) {
    if (!this.draggedNode) return;

    const canvasRect = this.canvas.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - this.dragOffsetX;
    const newY = e.clientY - canvasRect.top - this.dragOffsetY;

    this.draggedNode.el.style.left = `${newX}px`;
    this.draggedNode.el.style.top = `${newY}px`;

    const nodeWidth = this.draggedNode.el.offsetWidth;
    const nodeHeight = this.draggedNode.el.offsetHeight;
    this.draggedNode.x = newX + nodeWidth / 2;
    this.draggedNode.y = newY + nodeHeight / 2;

    // Check proximity to other nodes for magnetic fusion snap!
    const nearby = this.findNearbyNode(this.draggedNode.x, this.draggedNode.y, 110, this.draggedNode.id);

    if (nearby) {
      this.hoverTargetNode = nearby;
      nearby.el.classList.add('snap-hover');
      this.drawMagneticBond(this.draggedNode, nearby);

      const reaction = PHYSICS_DATA.findReaction(this.draggedNode.data, nearby.data);
      this.showHudPreview(nearby.x, nearby.y, this.draggedNode.data, nearby.data, reaction);
    } else {
      if (this.hoverTargetNode) {
        this.hoverTargetNode.el.classList.remove('snap-hover');
        this.hoverTargetNode = null;
      }
      this.clearSvgLine();
      this.hideHudPreview();
    }
  }

  onPointerUp(e) {
    if (!this.draggedNode) return;

    const sourceNode = this.draggedNode;
    const targetNode = this.hoverTargetNode;

    sourceNode.el.classList.remove('is-dragging');
    this.clearSvgLine();
    this.hideHudPreview();

    if (targetNode) {
      targetNode.el.classList.remove('snap-hover');
      this.hoverTargetNode = null;
      this.attemptFusion(targetNode, sourceNode);
    }

    this.draggedNode = null;
  }

  /**
   * Attempt fusion between two entities
   */
  attemptFusion(nodeA, nodeB) {
    const reaction = PHYSICS_DATA.findReaction(nodeA.data, nodeB.data);

    if (reaction) {
      // SUCCESSFUL FUSION!
      window.soundManager.playSuccess();

      const midX = (nodeA.x + (nodeB.x || nodeA.x)) / 2;
      const midY = (nodeA.y + (nodeB.y || nodeA.y)) / 2;

      // Particle explosion at collision site
      this.spawnParticleRipple(midX, midY);

      // Remove fused nodes from canvas
      this.removeNode(nodeA.id);
      if (nodeB.id) this.removeNode(nodeB.id);

      // Spawn the resulting Formula Node
      const newFormulaNode = this.spawnFormulaNode(reaction, midX, midY);

      // Confetti burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: (this.canvas.getBoundingClientRect().left + midX) / window.innerWidth,
            y: (this.canvas.getBoundingClientRect().top + midY) / window.innerHeight
          }
        });
      }

      // Record in App State (Codex, unlocks, etc.)
      if (window.appState) {
        window.appState.recordDiscovery(reaction);
      }
    } else {
      // Incompatible fusion
      window.soundManager.playError();
      if (nodeA && nodeA.el) {
        nodeA.el.classList.add('fusion-reject');
        setTimeout(() => nodeA.el.classList.remove('fusion-reject'), 450);
      }
      if (nodeB && nodeB.el) {
        nodeB.el.classList.add('fusion-reject');
        setTimeout(() => nodeB.el.classList.remove('fusion-reject'), 450);
      }
    }
  }

  /**
   * Decompose a formula node back into its constituent quantities
   */
  decomposeFormula(formulaNode) {
    const formula = formulaNode.data;
    const q1 = PHYSICS_DATA.quantities.find(q => q.id === formula.inputs[0]);
    const q2 = PHYSICS_DATA.quantities.find(q => q.id === formula.inputs[1]);

    const x = formulaNode.x;
    const y = formulaNode.y;

    this.removeNode(formulaNode.id);
    window.soundManager.playPop();

    if (q1) this.spawnQuantityNode(q1, x - 70, y);
    if (q2) this.spawnQuantityNode(q2, x + 70, y);
  }

  removeNode(id) {
    const node = this.nodes.get(id);
    if (node) {
      node.el.classList.add('node-exit');
      setTimeout(() => {
        node.el.remove();
        this.nodes.delete(id);
        this.updateEmptyState();
      }, 200);
    }
  }

  findNearbyNode(x, y, radius = 90, ignoreId = null) {
    for (const [id, node] of this.nodes) {
      if (id === ignoreId) continue;
      const dx = node.x - x;
      const dy = node.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        return node;
      }
    }
    return null;
  }

  drawMagneticBond(nodeA, nodeB) {
    if (!this.svgLayer) return;

    const x1 = nodeA.x;
    const y1 = nodeA.y;
    const x2 = nodeB.x;
    const y2 = nodeB.y;

    this.svgLayer.innerHTML = `
      <defs>
        <linearGradient id="magneticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
            stroke="url(#magneticGrad)" stroke-width="3" stroke-dasharray="6,4" class="magnetic-beam"/>
      <circle cx="${x1}" cy="${y1}" r="6" fill="#38bdf8"/>
      <circle cx="${x2}" cy="${y2}" r="6" fill="#10b981"/>
    `;
  }

  clearSvgLine() {
    if (this.svgLayer) this.svgLayer.innerHTML = '';
  }

  showHudPreview(targetX, targetY, itemA, itemB, reaction) {
    if (!this.hudPill) return;

    this.hudPill.classList.remove('hidden');
    this.hudPill.style.left = `${targetX}px`;
    this.hudPill.style.top = `${targetY - 55}px`;

    const nameA = itemA.symbol || itemA.title || 'A';
    const nameB = itemB.symbol || itemB.title || 'B';

    if (reaction) {
      this.hudPill.className = 'canvas-hud-pill hud-success';
      this.hudPill.innerHTML = `
        <span class="hud-sparkle">✦</span>
        <span>${nameA} + ${nameB} ➔ <strong>${reaction.title}</strong></span>
      `;
    } else {
      this.hudPill.className = 'canvas-hud-pill hud-incompatible';
      this.hudPill.innerHTML = `
        <span>${nameA} + ${nameB} (Bağıntı yok)</span>
      `;
    }
  }

  hideHudPreview() {
    if (this.hudPill) {
      this.hudPill.classList.add('hidden');
    }
  }

  spawnParticleRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'canvas-fusion-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    this.canvas.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }
}

window.interactiveCanvas = new InteractivePhysicsCanvas();
