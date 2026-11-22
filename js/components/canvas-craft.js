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

      // Check proximity to any node within 55px for deliberate fusion
      const nearbyNode = this.findNearbyNode(dropX, dropY, 55);
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
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

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

    const baseQuantityIds = ['mass', 'distance', 'displacement', 'time', 'current', 'temperature', 'amount_of_substance', 'luminous_intensity'];
    const canDecomposeQuantity = !baseQuantityIds.includes(quantity.id) && quantity.dimension && quantity.dimension !== '[1]';

    el.classList.add(typeClass);

    el.innerHTML = `
      <div class="token-header">
        <span class="token-type-pill">${typeLabel}</span>
        <div class="flex items-center gap-1">
          ${canDecomposeQuantity ? `<button class="token-action-btn token-decompose-btn" title="En İnce Temel Bileşenlerine Ayrıştır (Atomik SI)"><i data-lucide="atom" class="w-3.5 h-3.5 text-cyan-400"></i></button>` : ''}
          <button class="token-close-btn" title="Kaldır"><i data-lucide="x" class="w-3 h-3 text-slate-400"></i></button>
        </div>
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
      constituents: constituents || this.resolveConstituentsForNode({ type: 'quantity', data: quantity }),
      x: parseInt(el.style.left) + 65,
      y: parseInt(el.style.top) + 60,
      el: el
    };

    this.nodes.set(instanceId, nodeObj);
    this.attachNodeInteraction(nodeObj);
    this.updateEmptyState();

    const tokenDecomposeBtn = el.querySelector('.token-decompose-btn');
    if (tokenDecomposeBtn) {
      tokenDecomposeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.decomposeAtomic(nodeObj);
      });
    }

    // Spawn entrance animation
    el.classList.add('node-enter');
    setTimeout(() => el.classList.remove('node-enter'), 400);

    return nodeObj;
  }

  /**
   * Spawn a Merged Formula Node
   */
  spawnFormulaNode(formula, x, y, constituents = null) {
    const instanceId = 'formula_' + (this.nextInstanceId++);
    const el = document.createElement('div');
    el.className = 'canvas-node formula-node';
    el.dataset.nodeId = instanceId;

    el.innerHTML = `
      <div class="formula-node-header">
        <span class="formula-badge-category">${formula.category}</span>
        <div class="flex items-center gap-1">
          <button class="formula-action-btn formula-atomic-btn" title="En İnce Temel Bileşenlerine Ayrıştır (Atomik SI: m, x, t...)"><i data-lucide="atom" class="w-3.5 h-3.5 text-cyan-400"></i></button>
          <button class="formula-action-btn formula-decompose-btn" title="1 Adım Geri Ayrıştır"><i data-lucide="split" class="w-3.5 h-3.5 text-amber-400"></i></button>
          <button class="token-close-btn" title="Kaldır"><i data-lucide="x" class="w-3.5 h-3.5 text-slate-400"></i></button>
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
      constituents: constituents || this.resolveConstituentsForNode({ type: 'formula', data: formula }),
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

    el.querySelector('.formula-atomic-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.decomposeAtomic(nodeObj);
    });

    el.querySelector('.formula-decompose-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.decomposeStep(nodeObj);
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
      const doClose = (e) => {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }
        this.removeNode(nodeObj.id);
        window.soundManager.playPop();
      };
      closeBtn.addEventListener('click', doClose);
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

    // Pointer Drag Handling - Smooth, unconstrained freeform dragging
    el.addEventListener('pointerdown', (e) => {
      // Do not drag if clicked on any interactive button
      if (e.target.closest('button')) return;
      e.preventDefault();
      
      this.draggedNode = nodeObj;
      el.classList.add('is-dragging');

      // Bring active card to the front of the canvas
      this.nodesContainer.appendChild(el);

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

    const nodeWidth = this.draggedNode.el.offsetWidth || 130;
    const nodeHeight = this.draggedNode.el.offsetHeight || 100;

    // Clamp coordinates safely within the canvas workspace
    const maxLeft = Math.max(10, this.canvas.clientWidth - nodeWidth - 10);
    const maxTop = Math.max(10, this.canvas.clientHeight - nodeHeight - 10);
    const clampedX = Math.max(10, Math.min(maxLeft, newX));
    const clampedY = Math.max(10, Math.min(maxTop, newY));

    this.draggedNode.el.style.left = `${clampedX}px`;
    this.draggedNode.el.style.top = `${clampedY}px`;
    this.draggedNode.x = clampedX + nodeWidth / 2;
    this.draggedNode.y = clampedY + nodeHeight / 2;

    // Check proximity to other nodes for magnetic fusion snap (tight, deliberate 65px radius)
    const nearby = this.findNearbyNode(this.draggedNode.x, this.draggedNode.y, 65, this.draggedNode.id);

    if (nearby) {
      this.hoverTargetNode = nearby;
      nearby.el.classList.add('snap-hover');
      this.drawMagneticBond(this.draggedNode, nearby);

      const reaction = PHYSICS_DATA.findReaction(this.draggedNode.data, nearby.data) || this.createCustomReaction(this.draggedNode.data, nearby.data);
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

    // Preserve exact drop location coordinates
    const nodeWidth = sourceNode.el.offsetWidth || 130;
    const nodeHeight = sourceNode.el.offsetHeight || 100;
    sourceNode.x = parseInt(sourceNode.el.style.left) + nodeWidth / 2;
    sourceNode.y = parseInt(sourceNode.el.style.top) + nodeHeight / 2;

    if (targetNode) {
      targetNode.el.classList.remove('snap-hover');
      this.hoverTargetNode = null;
      this.attemptFusion(targetNode, sourceNode);
    }

    this.draggedNode = null;
  }

  /**
   * Attempt fusion between two entities (handles both registered and unregistered combinations)
   */
  attemptFusion(nodeA, nodeB) {
    let reaction = PHYSICS_DATA.findReaction(nodeA.data, nodeB.data);

    // If not a registered textbook formula, flexibly synthesize an unregistered custom physical formula!
    if (!reaction) {
      reaction = this.createCustomReaction(nodeA.data, nodeB.data);
    }

    if (reaction) {
      window.soundManager.playSuccess();

      const midX = (nodeA.x + (nodeB.x || nodeA.x)) / 2;
      const midY = (nodeA.y + (nodeB.y || nodeA.y)) / 2;

      // Particle explosion at collision site
      this.spawnParticleRipple(midX, midY);

      // Remove fused nodes from canvas
      this.removeNode(nodeA.id);
      if (nodeB.id) this.removeNode(nodeB.id);

      // Combine constituents from both nodes with exact multiplicity!
      const constituentsA = this.resolveConstituentsForNode(nodeA);
      const constituentsB = this.resolveConstituentsForNode(nodeB);
      const combinedConstituents = [...constituentsA, ...constituentsB];

      // Spawn the resulting Formula Node
      const newFormulaNode = this.spawnFormulaNode(reaction, midX, midY, combinedConstituents);

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

      // Record in App State only if it's an official registered discovery
      if (window.appState && !reaction.isCustom) {
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
   * Dynamically synthesize a custom unregistered physical formula
   */
  createCustomReaction(entityA, entityB) {
    const nameA = entityA.name || entityA.title || 'Bileşen A';
    const nameB = entityB.name || entityB.title || 'Bileşen B';
    const symA = entityA.symbol || 'A';
    const symB = entityB.symbol || 'B';
    const dimA = entityA.dimension || entityA.dimensional || '[1]';
    const dimB = entityB.dimension || entityB.dimensional || '[1]';

    const combinedDim = this.multiplyDimensions(dimA, dimB);
    const customId = 'custom_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    return {
      id: customId,
      isCustom: true,
      title: `${nameA} & ${nameB} Sentezi`,
      katex: `${symA} \\cdot ${symB}`,
      category: 'Özel Sentez',
      badge: `${symA} · ${symB}`,
      description: `Serbestçe sentezlenmiş özel fiziksel bileşik. Boyut: ${combinedDim}`,
      inputs: [entityA.id || 'compA', entityB.id || 'compB'],
      dimensional: combinedDim,
      dimension: combinedDim,
      wikiQuery: nameA,
      intuition: `${nameA} (${symA}) ile ${nameB} (${symB}) büyüklüklerinin serbest fiziksel çarpımı. Boyut analizi: ${combinedDim}.`
    };
  }

  /**
   * Helper: Parse dimension string into powers map { M, L, T, I, Θ, N, J }
   */
  parseDimToPowers(dimStr) {
    const powers = { M: 0, L: 0, T: 0, I: 0, Θ: 0, N: 0, J: 0 };
    if (!dimStr) return powers;
    const superscripts = {
      '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5,
      '⁻¹': -1, '⁻²': -2, '⁻³': -3, '⁻⁴': -4, '⁻⁵': -5
    };
    const regex = /\[([MLTIΘNJ1])\](⁻?[¹²³⁴⁵\d]+)?/g;
    let match;
    while ((match = regex.exec(dimStr)) !== null) {
      const sym = match[1];
      if (sym === '1') continue;
      let p = 1;
      if (match[2]) {
        const pStr = match[2];
        if (superscripts[pStr] !== undefined) {
          p = superscripts[pStr];
        } else {
          const n = parseInt(pStr.replace('⁻', '-'));
          if (!isNaN(n)) p = n;
        }
      }
      powers[sym] = (powers[sym] || 0) + p;
    }
    return powers;
  }

  /**
   * Helper: Convert powers map back to dimension string
   */
  powersToDimStr(powers) {
    const toSuperscript = (num) => {
      if (num === 1) return '';
      const map = {
        '-1': '⁻¹', '-2': '⁻²', '-3': '⁻³', '-4': '⁻⁴', '-5': '⁻⁵',
        '2': '²', '3': '³', '4': '⁴', '5': '⁵'
      };
      return map[String(num)] || ('^' + num);
    };
    const order = ['M', 'L', 'T', 'I', 'Θ', 'N', 'J'];
    let str = '';
    for (const sym of order) {
      const p = powers[sym];
      if (p && p !== 0) {
        str += '[' + sym + ']' + toSuperscript(p);
      }
    }
    return str || '[1]';
  }

  /**
   * Helper: Multiply two dimension strings
   */
  multiplyDimensions(dimA, dimB) {
    const pA = this.parseDimToPowers(dimA);
    const pB = this.parseDimToPowers(dimB);
    const combined = {};
    for (const k of ['M', 'L', 'T', 'I', 'Θ', 'N', 'J']) {
      combined[k] = (pA[k] || 0) + (pB[k] || 0);
    }
    return this.powersToDimStr(combined);
  }

  /**
   * Helper: Extract effective single dimensional string from data
   */
  extractEffectiveDimension(data) {
    if (data.dimension) return data.dimension;
    if (data.resultQuantityId) {
      const q = PHYSICS_DATA.quantities.find(item => item.id === data.resultQuantityId);
      if (q && q.dimension) return q.dimension;
    }
    if (data.dimensional) {
      let str = data.dimensional;
      if (str.includes('=')) {
        str = str.split('=')[1].trim();
      }
      if (str.includes('(')) {
        str = str.split('(')[0].trim();
      }
      return str;
    }
    return '[1]';
  }

  /**
   * Helper: Extract exact fundamental SI quantities list (e.g. 2 times 'time' for T⁻²)
   */
  getFundamentalQuantitiesList(dimStr) {
    const powers = this.parseDimToPowers(dimStr);
    const result = [];
    const symbolToId = {
      'M': 'mass',
      'L': 'distance',
      'T': 'time',
      'I': 'current',
      'Θ': 'temperature',
      'N': 'amount_of_substance',
      'J': 'luminous_intensity'
    };
    for (const sym of ['M', 'L', 'T', 'I', 'Θ', 'N', 'J']) {
      const count = Math.abs(powers[sym] || 0);
      for (let i = 0; i < count; i++) {
        result.push(symbolToId[sym]);
      }
    }
    return result;
  }

  /**
   * Resolve constituent base quantity IDs for any node or data object
   */
  resolveConstituentsForNode(node) {
    if (node && node.constituents && node.constituents.length > 0) {
      return [...node.constituents];
    }
    const data = (node && node.data) ? node.data : (node || {});
    const baseIds = ['mass', 'distance', 'displacement', 'time', 'current', 'temperature', 'amount_of_substance', 'luminous_intensity'];
    if (data.id && baseIds.includes(data.id)) {
      return [data.id === 'displacement' ? 'distance' : data.id];
    }
    const dimStr = this.extractEffectiveDimension(data);
    const list = this.getFundamentalQuantitiesList(dimStr);
    if (list && list.length > 0) return list;
    if (data.inputs && data.inputs.length > 0) return data.inputs;
    return [data.id || 'mass'];
  }

  /**
   * Full fundamental atomic decomposition (down to basic SI quantities with exact multiplicity: m, x, t, t...)
   */
  decomposeAtomic(node) {
    const data = node.data;
    const x = node.x;
    const y = node.y;

    let fundamentalIds = [];
    if (node && node.constituents && node.constituents.length > 0) {
      fundamentalIds = [...node.constituents];
    } else {
      fundamentalIds = this.resolveConstituentsForNode(node);
    }

    if (fundamentalIds.length === 0) {
      fundamentalIds = ['mass', 'distance', 'time'];
    }

    // Map IDs to actual quantity objects
    const quantitiesToSpawn = fundamentalIds
      .map(id => PHYSICS_DATA.quantities.find(q => q.id === id))
      .filter(Boolean);

    // Remove the original node
    this.removeNode(node.id);
    window.soundManager.playPop();
    this.spawnParticleRipple(x, y);

    // Lay out spawned tokens in a clean orbital polygon around (x, y)
    const count = quantitiesToSpawn.length;
    const radius = Math.max(90, Math.min(210, 50 + count * 22));

    quantitiesToSpawn.forEach((q, index) => {
      const angle = (2 * Math.PI * index) / count - Math.PI / 2;
      const targetX = x + Math.cos(angle) * radius;
      const targetY = y + Math.sin(angle) * radius;
      this.spawnQuantityNode(q, targetX, targetY);
    });
  }

  /**
   * 1-Step decomposition into immediate constituent inputs
   */
  decomposeStep(node) {
    const data = node.data;
    const x = node.x;
    const y = node.y;

    let inputIds = data.inputs || [];
    if (inputIds.length === 0 && data.fallbackInputs) {
      inputIds = data.fallbackInputs;
    }

    if (inputIds.length < 2) {
      this.decomposeAtomic(node);
      return;
    }

    const q1 = PHYSICS_DATA.quantities.find(q => q.id === inputIds[0]);
    const q2 = PHYSICS_DATA.quantities.find(q => q.id === inputIds[1]);

    if (!q1 || !q2) {
      this.decomposeAtomic(node);
      return;
    }

    this.removeNode(node.id);
    window.soundManager.playPop();
    this.spawnParticleRipple(x, y);

    this.spawnQuantityNode(q1, x - 85, y);
    this.spawnQuantityNode(q2, x + 85, y);
  }

  /**
   * Backward-compatible alias
   */
  decomposeFormula(formulaNode) {
    this.decomposeAtomic(formulaNode);
  }

  removeNode(id) {
    const node = this.nodes.get(id);
    if (node) {
      if (this.draggedNode && this.draggedNode.id === id) {
        this.draggedNode = null;
      }
      if (this.hoverTargetNode && this.hoverTargetNode.id === id) {
        this.hoverTargetNode = null;
      }
      node.el.style.pointerEvents = 'none';
      node.el.classList.add('node-exit');
      this.nodes.delete(id);
      this.updateEmptyState();
      setTimeout(() => {
        node.el.remove();
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
      this.hudPill.className = 'canvas-hud-pill hud-success flex items-center gap-1.5';
      this.hudPill.innerHTML = `
        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-300"></i>
        <span>${nameA} + ${nameB} <i data-lucide="arrow-right" class="w-3 h-3 inline mx-0.5 text-emerald-400"></i> <strong>${reaction.title}</strong></span>
      `;
      if (window.lucide) lucide.createIcons({ root: this.hudPill });
    } else {
      this.hudPill.className = 'canvas-hud-pill hud-incompatible flex items-center gap-1.5';
      this.hudPill.innerHTML = `
        <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-rose-400"></i>
        <span>${nameA} + ${nameB} (Bağıntı yok)</span>
      `;
      if (window.lucide) lucide.createIcons({ root: this.hudPill });
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
