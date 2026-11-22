/**
 * AI Physics Intuition & Coach Component
 * Deep physical intuition, dimensional analysis, everyday analogies & Gemini API integration
 */

class AIAssistant {
  constructor() {
    this.apiKey = localStorage.getItem('physics_alchemy_gemini_key') || '';
    this.feed = document.getElementById('aiChatFeed');
    this.form = document.getElementById('aiPromptForm');
    this.input = document.getElementById('aiUserInput');
    this.statusText = document.getElementById('aiStatusText');
    this.drawer = document.getElementById('aiAssistantDrawer');
    this.closeBtn = document.getElementById('closeAiDrawerBtn');

    this.initEvents();
    this.updateStatus();
  }

  initEvents() {
    if (this.closeBtn && this.drawer) {
      this.closeBtn.addEventListener('click', () => {
        this.drawer.classList.add('hidden');
        this.drawer.classList.remove('flex');
      });
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.input.value.trim();
        if (!text) return;
        this.input.value = '';
        this.handleUserPrompt(text);
      });
    }

    const hintBtn = document.getElementById('aiHintBtn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.generateHint());
    }

    const scalarInfoBtn = document.getElementById('aiScalarInfoBtn');
    if (scalarInfoBtn) {
      scalarInfoBtn.addEventListener('click', () => this.explainScalarVsVector());
    }

    // API Key Modal Handlers
    const openSettingsBtn = document.getElementById('openAiSettingsBtn');
    const settingsModal = document.getElementById('aiSettingsModal');
    const closeSettingsBtn = document.getElementById('closeAiSettingsBtn');
    const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
    const clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
    const apiKeyInput = document.getElementById('geminiApiKeyInput');

    if (openSettingsBtn && settingsModal) {
      openSettingsBtn.addEventListener('click', () => {
        apiKeyInput.value = this.apiKey;
        settingsModal.classList.remove('hidden');
        setTimeout(() => settingsModal.classList.remove('opacity-0'), 10);
      });
    }

    if (closeSettingsBtn && settingsModal) {
      closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('opacity-0');
        setTimeout(() => settingsModal.classList.add('hidden'), 200);
      });
    }

    if (saveApiKeyBtn) {
      saveApiKeyBtn.addEventListener('click', () => {
        this.apiKey = apiKeyInput.value.trim();
        localStorage.setItem('physics_alchemy_gemini_key', this.apiKey);
        this.updateStatus();
        this.appendCard('assistant', '✨ <strong>Gemini API Anahtarınız kaydedildi!</strong> Doğrudan Google Gemini ile canlı soru-cevap yapabilirsiniz.');
        settingsModal.classList.add('opacity-0');
        setTimeout(() => settingsModal.classList.add('hidden'), 200);
      });
    }

    if (clearApiKeyBtn) {
      clearApiKeyBtn.addEventListener('click', () => {
        this.apiKey = '';
        apiKeyInput.value = '';
        localStorage.removeItem('physics_alchemy_gemini_key');
        this.updateStatus();
        this.appendCard('assistant', 'ℹ️ API anahtarı temizlendi. Dahili fizik motoru aktif.');
        settingsModal.classList.add('opacity-0');
        setTimeout(() => settingsModal.classList.add('hidden'), 200);
      });
    }
  }

  updateStatus() {
    if (this.statusText) {
      if (this.apiKey) {
        this.statusText.textContent = 'Gemini AI Aktif (Canlı)';
        this.statusText.classList.replace('text-purple-400', 'text-emerald-400');
      } else {
        this.statusText.textContent = 'Dahili Akıllı Fizikçi';
        this.statusText.classList.replace('text-emerald-400', 'text-purple-400');
      }
    }
  }

  appendCard(sender, htmlContent) {
    if (!this.feed) return;

    const card = document.createElement('div');
    if (sender === 'user') {
      card.className = 'bg-cyan-950/60 border border-cyan-800/80 rounded-xl p-3 text-cyan-200 text-xs ml-4 shadow';
      card.innerHTML = `<div class="font-bold text-[10px] text-cyan-400 mb-1">SENİN SORUN:</div>${htmlContent}`;
    } else {
      card.className = 'bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-300 text-xs space-y-2 leading-relaxed shadow';
      card.innerHTML = htmlContent;
    }

    this.feed.appendChild(card);
    this.feed.scrollTop = this.feed.scrollHeight;
    lucide.createIcons();
  }

  /**
   * Deep Formula Explanation Card (Triggered by "Fizik Sezgisi" button on any formula node)
   */
  explainFormulaDeeply(formula) {
    const html = `
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">${formula.category}</span>
        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">${formula.badge}</span>
      </div>
      <h3 class="text-sm font-bold text-white">${formula.title}</h3>
      <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-serif text-emerald-300 text-center text-base formula-deep-display"></div>
      <div>
        <h4 class="text-[11px] font-bold text-slate-300 mb-0.5">🧠 Fiziksel Sezgi & Anlamı:</h4>
        <p class="text-slate-300 leading-relaxed">${formula.intuition || formula.description}</p>
      </div>
      <div class="bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
        <span class="text-slate-400 font-semibold">Boyut Analizi:</span>
        <span class="font-mono text-cyan-400 ml-1">${formula.dimensional || 'Standart SI'}</span>
      </div>
    `;

    this.appendCard('assistant', html);

    // Render KaTeX inside the appended card
    const lastCard = this.feed.lastElementChild;
    const formulaDiv = lastCard ? lastCard.querySelector('.formula-deep-display') : null;
    if (formulaDiv) {
      if (typeof window.renderMath === 'function') {
        window.renderMath(formulaDiv, formula.katex, true);
      } else if (window.katex) {
        try {
          katex.render(formula.katex, formulaDiv, { displayMode: true, throwOnError: false });
        } catch (e) {}
      }
    }
  }

  generateHint() {
    if (!window.appState) return;

    const unlocked = window.appState.unlockedQuantities;
    const discovered = window.appState.discoveredFormulas;

    const candidate = PHYSICS_DATA.formulas.find(f => {
      const notDone = !discovered.has(f.id);
      const has1 = unlocked.has(f.inputs[0]);
      const has2 = unlocked.has(f.inputs[1]);
      return notDone && has1 && has2;
    });

    if (candidate) {
      const q1 = PHYSICS_DATA.quantities.find(q => q.id === candidate.inputs[0]);
      const q2 = PHYSICS_DATA.quantities.find(q => q.id === candidate.inputs[1]);

      this.appendCard('assistant', `
        <div class="font-bold text-purple-400 flex items-center gap-1.5">
          <i data-lucide="lightbulb" class="w-4 h-4 text-amber-400"></i> Fizik Laboratuvarı İpucu
        </div>
        <p>Şu anda elinde açık olan <strong>${q1.name} (${q1.symbol})</strong> ile <strong>${q2.name} (${q2.symbol})</strong> büyüklükleri arasında doğanın çok önemli bir kanunu gizli!</p>
        <p class="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
          Bu ikisini masaya sürükleyip birbirinin üzerine bırakarak <strong>${candidate.category}</strong> alanında yeni bir formül keşfedebilirsin.
        </p>
      `);
    } else {
      this.appendCard('assistant', `
        <div class="font-bold text-emerald-400">Tebrikler!</div>
        <p>Şu anki açık büyüklüklerle keşfedilebilecek temel kombinasyonların çoğunu açtın! Keşfettiğin formülleri veya yeni açılan türetilmiş büyüklükleri birbirinin üzerine sürükleyerek zincirleme reaksiyonları dene.</p>
      `);
    }
  }

  explainScalarVsVector() {
    this.appendCard('assistant', `
      <div class="font-bold text-white flex items-center gap-1.5">
        <i data-lucide="compass" class="w-4 h-4 text-rose-400"></i> Skaler ve Vektörel Ayrımı
      </div>
      <p>🔵 <strong>Skaler Büyüklükler (Mavi):</strong> Yön gerektirmeyen, sadece sayı ve birimle tam tanımlanan büyüklüklerdir. Örn: <em>Kütle (5 kg), Sıcaklık (300 K), Enerji (100 J), Zaman (10 s)</em>.</p>
      <p>🔴 <strong>Vektörel Büyüklükler (Kırmızı):</strong> Sayı ve birimin yanında yön ve doğrultu gerektirir. Örn: <em>Kuvvet (F⃗), Hız (v⃗), İvme (a⃗), Yer Değiştirme (Δx⃗)</em>.</p>
      <p class="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
        💡 <em>İlginç Fizik Kuralı: İki vektörün skaler (nokta) çarpımı skaler bir büyüklük üretir! Örn: Kuvvet (Vektör) · Yer Değiştirme (Vektör) = İş/Enerji (Skaler).</em>
      </p>
    `);
  }

  /**
   * Deep Formula Explanation Card (Triggered by "Fizik Sezgisi" button on any formula node)
   */
  explainFormulaDeeply(formula) {
    const html = `
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">${formula.category}</span>
        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">${formula.badge}</span>
      </div>
      <h3 class="text-sm font-bold text-white">${formula.title}</h3>
      <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-serif text-emerald-300 text-center text-base formula-deep-display"></div>
      <div>
        <h4 class="text-[11px] font-bold text-slate-300 mb-0.5">🧠 Fiziksel Sezgi & Anlamı:</h4>
        <p class="text-slate-300 leading-relaxed">${formula.intuition || formula.description}</p>
      </div>
      <div class="bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
        <span class="text-slate-400 font-semibold">Boyut Analizi:</span>
        <span class="font-mono text-cyan-400 ml-1">${formula.dimensional || 'Standart SI'}</span>
      </div>
    `;

    this.appendCard('assistant', html);

    // Render KaTeX inside the appended card
    const lastCard = this.feed.lastElementChild;
    const formulaDiv = lastCard ? lastCard.querySelector('.formula-deep-display') : null;
    if (formulaDiv) {
      if (typeof window.renderMath === 'function') {
        window.renderMath(formulaDiv, formula.katex, true);
      } else if (window.katex) {
        try {
          katex.render(formula.katex, formulaDiv, { displayMode: true, throwOnError: false });
        } catch (e) {}
      }
    }
  }

  generateHint() {
    if (!window.appState) return;

    const unlocked = window.appState.unlockedQuantities;
    const discovered = window.appState.discoveredFormulas;

    const candidate = PHYSICS_DATA.formulas.find(f => {
      const notDone = !discovered.has(f.id);
      const has1 = unlocked.has(f.inputs[0]);
      const has2 = unlocked.has(f.inputs[1]);
      return notDone && has1 && has2;
    });

    if (candidate) {
      const q1 = PHYSICS_DATA.quantities.find(q => q.id === candidate.inputs[0]);
      const q2 = PHYSICS_DATA.quantities.find(q => q.id === candidate.inputs[1]);

      this.appendCard('assistant', `
        <div class="font-bold text-purple-400 flex items-center gap-1.5">
          <i data-lucide="lightbulb" class="w-4 h-4 text-amber-400"></i> Fizik Laboratuvarı İpucu
        </div>
        <p>Şu anda elinde açık olan <strong>${q1.name} (${q1.symbol})</strong> ile <strong>${q2.name} (${q2.symbol})</strong> büyüklükleri arasında doğanın çok önemli bir kanunu gizli!</p>
        <p class="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
          Bu ikisini masaya sürükleyip birbirinin üzerine bırakarak <strong>${candidate.category}</strong> alanında yeni bir formül keşfedebilirsin.
        </p>
      `);
    } else {
      this.appendCard('assistant', `
        <div class="font-bold text-emerald-400">Tebrikler!</div>
        <p>Şu anki açık büyüklüklerle keşfedilebilecek temel kombinasyonların çoğunu açtın! Keşfettiğin formülleri veya yeni açılan türetilmiş büyüklükleri birbirinin üzerine sürükleyerek zincirleme reaksiyonları dene.</p>
      `);
    }
  }

  explainScalarVsVector() {
    this.appendCard('assistant', `
      <div class="font-bold text-white flex items-center gap-1.5">
        <i data-lucide="compass" class="w-4 h-4 text-rose-400"></i> Skaler ve Vektörel Ayrımı
      </div>
      <p>🔵 <strong>Skaler Büyüklükler (Mavi):</strong> Yön gerektirmeyen, sadece sayı ve birimle tam tanımlanan büyüklüklerdir. Örn: <em>Kütle (5 kg), Sıcaklık (300 K), Enerji (100 J), Zaman (10 s)</em>.</p>
      <p>🔴 <strong>Vektörel Büyüklükler (Kırmızı):</strong> Sayı ve birimin yanında yön ve doğrultu gerektirir. Örn: <em>Kuvvet (F⃗), Hız (v⃗), İvme (a⃗), Yer Değiştirme (Δx⃗)</em>.</p>
      <p class="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
        💡 <em>İlginç Fizik Kuralı: İki vektörün skaler (nokta) çarpımı skaler bir büyüklük üretir! Örn: Kuvvet (Vektör) · Yer Değiştirme (Vektör) = İş/Enerji (Skaler).</em>
      </p>
    `);
  }

  async handleUserPrompt(userText) {
    this.appendCard('user', userText);

    if (this.apiKey) {
      await this.callGeminiAPI(userText);
    } else {
      this.respondOffline(userText);
    }
  }

  async callGeminiAPI(userText) {
    const loadingId = 'ai-loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-slate-400 text-xs flex items-center gap-2';
    loadingDiv.innerHTML = `
      <div class="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Gemini düşünüyor...</span>
    `;
    this.feed.appendChild(loadingDiv);
    this.feed.scrollTop = this.feed.scrollHeight;

    const unlockedQuantities = window.appState ? Array.from(window.appState.unlockedQuantities).join(', ') : 'Temel büyüklükler';
    const systemPrompt = `Sen bir fizik profesörü ve interaktif fizik laboratuvarı mentörüsün. Kullanıcı 'lazaloglucafizik' uygulamasında büyüklükleri birbirinin veya formüllerin üzerine sürükleyerek kanunları sentezliyor. Kullanıcının açık büyüklükleri: ${unlockedQuantities}. Cevapların net, Türkçe, samimi, fiziksel sezgiye dayalı olsun (AI slop / boş laf kalıpları olmasın). Formülleri KaTeX formatında yaz.`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nKullanıcı: ${userText}` }] }]
        })
      });

      const data = await response.json();
      document.getElementById(loadingId)?.remove();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        let reply = data.candidates[0].content.parts[0].text;
        reply = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        reply = reply.replace(/\n/g, '<br>');
        this.appendCard('assistant', reply);
      } else {
        this.respondOffline(userText);
      }
    } catch (err) {
      document.getElementById(loadingId)?.remove();
      this.respondOffline(userText);
    }
  }

  respondOffline(userText) {
    const text = userText.toLowerCase();

    if (text.includes('ipucu') || text.includes('ne yap') || text.includes('yardım')) {
      this.generateHint();
      return;
    }
    if (text.includes('skaler') || text.includes('vektör')) {
      this.explainScalarVsVector();
      return;
    }

    this.appendCard('assistant', `
      <p>Fizikte doğa kanunları, temel skaler ve vektörel büyüklüklerin çarpımları ve oranları üzerinden kurulur.</p>
      <p>Örneğin masadaki bir formülün (örn: <strong>F = ma</strong>) üzerine başka bir büyüklük (örn: <strong>Mesafe x</strong>) sürükleyerek daha üst düzey kanunları (örn: <strong>W = F·x</strong>) zincirleme sentezleyebilirsin!</p>
    `);
  }
}

window.aiAssistant = new AIAssistant();
