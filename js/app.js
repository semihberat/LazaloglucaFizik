/**
 * Main Application Orchestrator
 * Connects Sidebar, Canvas, Codex, and Discovery State
 */

class PhysicsAlchemyApp {
  constructor() {
    this.unlockedQuantities = new Set();
    this.discoveredFormulas = new Set();
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.draggedSidebarQuantityId = null;

    // DOM References
    this.quantitiesList = document.getElementById('quantitiesList');
    this.inventoryBadge = document.getElementById('inventoryBadge');
    this.quantitySearch = document.getElementById('quantitySearch');
    this.filterButtons = document.querySelectorAll('.filter-btn');

    this.headerFormulaCount = document.getElementById('headerFormulaCount');
    this.headerQuantityCount = document.getElementById('headerQuantityCount');
    this.headerProgressBar = document.getElementById('headerProgressBar');

    this.codexModal = document.getElementById('codexModal');
    this.openCodexBtn = document.getElementById('openCodexBtn');
    this.closeCodexModalBtn = document.getElementById('closeCodexModalBtn');
    this.viewAllCodexLink = document.getElementById('viewAllCodexLink');
    this.codexCount = document.getElementById('codexCount');
    this.codexGrid = document.getElementById('codexGrid');
    this.codexSearch = document.getElementById('codexSearch');
    this.codexFilterButtons = document.querySelectorAll('.codex-filter-btn');

    this.recentDiscoveriesStrip = document.getElementById('recentDiscoveriesStrip');
    this.toggleSoundBtn = document.getElementById('toggleSoundBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.resetProgressBtn = document.getElementById('resetProgressBtn');

    this.toggleAiPanelBtn = document.getElementById('toggleAiPanelBtn');
    this.aiDrawer = document.getElementById('aiAssistantDrawer');
    this.quickHintBtn = document.getElementById('quickHintBtn');

    this.loadState();
    this.initEventListeners();
    this.render();
  }

  loadState() {
    const saved = localStorage.getItem('physics_alchemy_save_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.unlockedQuantities = new Set(parsed.unlockedQuantities || []);
        this.discoveredFormulas = new Set(parsed.discoveredFormulas || []);
      } catch (e) {
        console.warn('Failed to parse save, initializing defaults:', e);
      }
    }

    PHYSICS_DATA.quantities.forEach(q => {
      if (q.isDefaultUnlocked) {
        this.unlockedQuantities.add(q.id);
      }
    });

    this.saveState();
  }

  saveState() {
    const data = {
      unlockedQuantities: Array.from(this.unlockedQuantities),
      discoveredFormulas: Array.from(this.discoveredFormulas)
    };
    localStorage.setItem('physics_alchemy_save_v2', JSON.stringify(data));
  }

  initEventListeners() {
    // Search input
    if (this.quantitySearch) {
      this.quantitySearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderSidebarList();
      });
    }

    // Filter Buttons
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        window.soundManager.playPop();
        this.renderSidebarList();
      });
    });

    // Sound toggle
    if (this.toggleSoundBtn) {
      this.toggleSoundBtn.addEventListener('click', () => {
        const isMuted = window.soundManager.toggleMute();
        this.updateSoundIcon(isMuted);
      });
      this.updateSoundIcon(window.soundManager.isMuted);
    }

    // Reset Progress
    if (this.resetProgressBtn) {
      this.resetProgressBtn.addEventListener('click', () => {
        if (confirm('Tüm keşifleri ve laboratuvar ilerlemesini sıfırlamak istiyor musunuz?')) {
          localStorage.removeItem('physics_alchemy_save_v2');
          this.unlockedQuantities.clear();
          this.discoveredFormulas.clear();
          PHYSICS_DATA.quantities.forEach(q => {
            if (q.isDefaultUnlocked) this.unlockedQuantities.add(q.id);
          });
          this.saveState();
          this.render();
          if (window.interactiveCanvas) window.interactiveCanvas.clearAll();
          window.soundManager.playPop();
        }
      });
    }

    // Codex triggers
    if (this.openCodexBtn) this.openCodexBtn.addEventListener('click', () => this.openCodex());
    if (this.viewAllCodexLink) this.viewAllCodexLink.addEventListener('click', () => this.openCodex());
    if (this.closeCodexModalBtn) this.closeCodexModalBtn.addEventListener('click', () => this.closeCodex());
    if (this.codexModal) {
      this.codexModal.addEventListener('click', (e) => {
        if (e.target === this.codexModal) this.closeCodex();
      });
    }

    if (this.codexSearch) {
      this.codexSearch.addEventListener('input', () => this.renderCodexGrid());
    }

    this.codexFilterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.codexFilterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCodexGrid();
      });
    });

    // AI Drawer toggle
    if (this.toggleAiPanelBtn && this.aiDrawer) {
      this.toggleAiPanelBtn.addEventListener('click', () => {
        this.aiDrawer.classList.toggle('hidden');
        this.aiDrawer.classList.toggle('flex');
        window.soundManager.playPop();
      });
    }

    if (this.quickHintBtn && window.aiAssistant) {
      this.quickHintBtn.addEventListener('click', () => {
        this.openAiDrawer();
        window.aiAssistant.generateHint();
      });
    }
  }

  openAiDrawer() {
    if (this.aiDrawer && this.aiDrawer.classList.contains('hidden')) {
      this.aiDrawer.classList.remove('hidden');
      this.aiDrawer.classList.add('flex');
    }
  }

  updateSoundIcon(isMuted) {
    if (this.soundIcon) {
      this.soundIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
      lucide.createIcons();
    }
  }

  recordDiscovery(formula) {
    const isNew = !this.discoveredFormulas.has(formula.id);
    this.discoveredFormulas.add(formula.id);

    if (formula.resultQuantityId) {
      this.unlockedQuantities.add(formula.resultQuantityId);
    }

    this.saveState();
    this.render();

    // Trigger AI intuition context update
    if (window.aiAssistant && isNew) {
      window.aiAssistant.explainFormulaDeeply(formula);
    }
  }

  render() {
    this.renderSidebarList();
    this.renderStats();
    this.renderRecentStrip();
  }

  renderStats() {
    const totalFormulas = PHYSICS_DATA.formulas.length;
    const discoveredCount = this.discoveredFormulas.size;
    const totalQuantities = PHYSICS_DATA.quantities.length;
    const unlockedCount = this.unlockedQuantities.size;

    const percent = Math.round((discoveredCount / totalFormulas) * 100);

    if (this.headerFormulaCount) this.headerFormulaCount.textContent = `${discoveredCount} / ${totalFormulas} Formül`;
    if (this.headerQuantityCount) this.headerQuantityCount.textContent = `${unlockedCount} / ${totalQuantities}`;
    if (this.headerProgressBar) this.headerProgressBar.style.width = `${percent}%`;
    if (this.inventoryBadge) this.inventoryBadge.textContent = `${unlockedCount} Açık`;
  }

  renderSidebarList() {
    if (!this.quantitiesList) return;
    this.quantitiesList.innerHTML = '';

    const available = PHYSICS_DATA.quantities.filter(q => this.unlockedQuantities.has(q.id));

    const filtered = available.filter(q => {
      if (this.currentFilter !== 'all' && q.type !== this.currentFilter) return false;
      if (this.searchQuery) {
        const matchesName = q.name.toLowerCase().includes(this.searchQuery);
        const matchesSymbol = q.symbol.toLowerCase().includes(this.searchQuery);
        const matchesUnit = q.unit.toLowerCase().includes(this.searchQuery);
        const matchesCategory = q.category.toLowerCase().includes(this.searchQuery);
        return matchesName || matchesSymbol || matchesUnit || matchesCategory;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.quantitiesList.innerHTML = `
        <div class="py-8 text-center text-slate-500 text-xs">
          <p>Eşleşen büyüklük bulunamadı.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(q => {
      const item = document.createElement('div');
      item.draggable = true;
      item.dataset.quantityId = q.id;

      const isScalar = q.type === 'scalar';
      const isConstant = q.type === 'constant';
      const typeBorder = isScalar 
        ? 'border-blue-900/40 hover:border-blue-500 bg-blue-950/20' 
        : (isConstant ? 'border-amber-900/40 hover:border-amber-500 bg-amber-950/20' : 'border-rose-900/40 hover:border-rose-500 bg-rose-950/20');

      const badgeColor = isScalar ? 'text-cyan-400 bg-cyan-950' : (isConstant ? 'text-amber-400 bg-amber-950' : 'text-rose-400 bg-rose-950');
      const typeLabel = isScalar ? 'Skaler' : (isConstant ? 'Sabit' : 'Vektör');

      item.className = `sidebar-quantity-item p-2.5 rounded-xl border ${typeBorder} backdrop-blur-sm flex items-center justify-between shadow-sm cursor-grab active:cursor-grabbing`;

      item.innerHTML = `
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-serif text-base font-semibold ${isScalar ? 'text-cyan-400' : (isConstant ? 'text-amber-400' : 'text-rose-400')}">
            ${q.symbol}
          </div>
          <div>
            <div class="text-xs font-bold text-slate-200">${q.name}</div>
            <div class="text-[10px] text-slate-500 font-mono">${q.unit}</div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-1">
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-800 ${badgeColor}">${typeLabel}</span>
          <span class="text-[9px] font-mono text-slate-500">${q.dimension}</span>
        </div>
      `;

      // Dragstart from sidebar
      item.addEventListener('dragstart', (e) => {
        this.draggedSidebarQuantityId = q.id;
        e.dataTransfer.setData('text/plain', q.id);
        e.dataTransfer.effectAllowed = 'copy';
        window.soundManager.playPop();
      });

      item.addEventListener('dragend', () => {
        this.draggedSidebarQuantityId = null;
      });

      // Click to spawn on canvas
      item.addEventListener('click', () => {
        if (window.interactiveCanvas) {
          const rect = window.interactiveCanvas.canvas.getBoundingClientRect();
          const randomOffsetX = (Math.random() - 0.5) * 160;
          const randomOffsetY = (Math.random() - 0.5) * 160;
          window.interactiveCanvas.spawnQuantityNode(q, rect.width / 2 + randomOffsetX, rect.height / 2 + randomOffsetY);
          window.soundManager.playPop();
        }
      });

      this.quantitiesList.appendChild(item);
    });

    lucide.createIcons();
  }

  renderRecentStrip() {
    if (!this.recentDiscoveriesStrip) return;
    const discoveredList = Array.from(this.discoveredFormulas).map(id => {
      return PHYSICS_DATA.formulas.find(f => f.id === id);
    }).filter(Boolean);

    if (discoveredList.length === 0) {
      this.recentDiscoveriesStrip.innerHTML = `
        <span class="text-[11px] text-slate-600 italic">Henüz bir formül keşfedilmedi. İki büyüklüğü birbirinin üzerine sürükle!</span>
      `;
      return;
    }

    this.recentDiscoveriesStrip.innerHTML = '';
    discoveredList.slice(-6).reverse().forEach(formula => {
      const chip = document.createElement('button');
      chip.className = 'px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-emerald-600 text-slate-300 hover:text-emerald-300 text-[11px] flex items-center gap-1.5 whitespace-nowrap transition';
      chip.innerHTML = `
        <i data-lucide="check" class="w-3 h-3 text-emerald-400"></i>
        <span>${formula.title}</span>
      `;
      chip.addEventListener('click', () => {
        if (window.wikiModalManager) {
          window.wikiModalManager.openFor(formula.wikiQuery, formula.title);
        }
      });
      this.recentDiscoveriesStrip.appendChild(chip);
    });

    lucide.createIcons();
  }

  openCodex() {
    this.renderCodexGrid();
    this.codexModal.classList.remove('hidden');
    setTimeout(() => {
      this.codexModal.classList.remove('opacity-0');
    }, 10);
  }

  closeCodex() {
    this.codexModal.classList.add('opacity-0');
    setTimeout(() => {
      this.codexModal.classList.add('hidden');
    }, 200);
  }

  renderCodexGrid() {
    if (!this.codexGrid) return;
    this.codexGrid.innerHTML = '';

    const total = PHYSICS_DATA.formulas.length;
    const discovered = this.discoveredFormulas.size;
    if (this.codexCount) this.codexCount.textContent = `${discovered} / ${total} Keşfedildi`;

    const activeFilterBtn = document.querySelector('.codex-filter-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.dataset.codexFilter : 'all';
    const query = this.codexSearch ? this.codexSearch.value.toLowerCase().trim() : '';

    PHYSICS_DATA.formulas.forEach(formula => {
      const isDiscovered = this.discoveredFormulas.has(formula.id);

      if (filter === 'discovered' && !isDiscovered) return;
      if (filter === 'locked' && isDiscovered) return;

      if (query && isDiscovered) {
        const matchesTitle = formula.title.toLowerCase().includes(query);
        const matchesCategory = formula.category.toLowerCase().includes(query);
        const matchesDesc = formula.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesDesc) return;
      }

      const card = document.createElement('div');
      
      if (isDiscovered) {
        card.className = 'p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-600/60 transition space-y-2';
        card.innerHTML = `
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">${formula.category}</span>
              <h4 class="text-xs font-bold text-white mt-0.5">${formula.title}</h4>
            </div>
            <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              ${formula.badge}
            </span>
          </div>

          <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-serif text-sm text-emerald-300 formula-codex-display"></div>

          <p class="text-[11px] text-slate-300 leading-relaxed">${formula.description}</p>

          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <button class="codex-wiki-btn text-cyan-400 hover:underline flex items-center gap-1">
              <i data-lucide="globe" class="w-3 h-3"></i> Vikipedi'de Gör
            </button>
            <button class="codex-ai-btn text-purple-400 hover:underline flex items-center gap-1">
              <i data-lucide="sparkles" class="w-3 h-3"></i> Sezgiyi İncele
            </button>
          </div>
        `;

        const formulaContainer = card.querySelector('.formula-codex-display');
        if (formulaContainer) {
          if (typeof window.renderMath === 'function') {
            window.renderMath(formulaContainer, formula.katex, false);
          } else if (window.katex) {
            try {
              katex.render(formula.katex, formulaContainer, { displayMode: false, throwOnError: false });
            } catch(e) {}
          }
        }

        card.querySelector('.codex-wiki-btn').addEventListener('click', () => {
          if (window.wikiModalManager) {
            window.wikiModalManager.openFor(formula.wikiQuery, formula.title);
          }
        });

        card.querySelector('.codex-ai-btn').addEventListener('click', () => {
          this.closeCodex();
          this.openAiDrawer();
          if (window.aiAssistant) {
            window.aiAssistant.explainFormulaDeeply(formula);
          }
        });
      } else {
        card.className = 'p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2 opacity-60';
        card.innerHTML = `
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-[9px] uppercase font-mono tracking-wider">${formula.category}</span>
            <i data-lucide="lock" class="w-3.5 h-3.5"></i>
          </div>
          <div class="text-xs font-bold text-slate-400">??? Kilitli Formül ???</div>
          <div class="p-2 rounded bg-slate-900 border border-slate-800 text-center text-[10px] text-slate-500 font-mono">
            Keşfetmek için büyüklükleri birbirinin üzerine sürükle
          </div>
        `;
      }

      this.codexGrid.appendChild(card);
    });

    lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appState = new PhysicsAlchemyApp();
  lucide.createIcons();
});
