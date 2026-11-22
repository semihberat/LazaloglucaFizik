/**
 * AI Physics Assistant & Real Debate Engine (Gemini 3.5 Flash)
 * Real multi-turn physics discussion, KaTeX rendering & deep intuition
 */

class AIAssistant {
  constructor() {
    const _k = 'QVEuQWI4Uk42Skxka1dRTkRqZWtRRzZ2dy1FZXpsWEZRYUsxMndVdU9ENnRnWDJfWWpHaVE=';
    this.defaultApiKey = typeof atob === 'function' ? atob(_k) : '';
    this.apiKey = localStorage.getItem('physics_alchemy_gemini_key') || this.defaultApiKey;
    this.primaryModel = 'gemini-3.5-flash';
    this.fallbackModels = ['gemini-3.8-flash', 'gemini-flash-latest'];

    this.feed = document.getElementById('aiChatFeed');
    this.form = document.getElementById('aiPromptForm');
    this.input = document.getElementById('aiUserInput');
    this.statusText = document.getElementById('aiStatusText');
    this.drawer = document.getElementById('aiAssistantDrawer');
    this.closeBtn = document.getElementById('closeAiDrawerBtn');

    // Conversation history for true multi-turn debates
    this.chatHistory = [];

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
        const val = apiKeyInput.value.trim();
        this.apiKey = val || this.defaultApiKey;
        localStorage.setItem('physics_alchemy_gemini_key', this.apiKey);
        this.updateStatus();
        this.appendCard('assistant', '✨ <strong>LazalBot Fizik Mentörü Hazır!</strong> Artık her türlü fizik teorisi, paradoks ve matematiksel bağıntıyı tartışabiliriz.');
        settingsModal.classList.add('opacity-0');
        setTimeout(() => settingsModal.classList.add('hidden'), 200);
      });
    }

    if (clearApiKeyBtn) {
      clearApiKeyBtn.addEventListener('click', () => {
        this.apiKey = this.defaultApiKey;
        apiKeyInput.value = '';
        localStorage.removeItem('physics_alchemy_gemini_key');
        this.updateStatus();
        this.appendCard('assistant', 'ℹ️ Varsayılan LazalBot çekirdeği aktif.');
        settingsModal.classList.add('opacity-0');
        setTimeout(() => settingsModal.classList.add('hidden'), 200);
      });
    }
  }

  updateStatus() {
    if (this.statusText) {
      this.statusText.textContent = 'LazalBot Aktif (Çevrimiçi)';
      this.statusText.className = 'text-[10px] text-emerald-400 font-medium';
    }
  }

  appendCard(sender, htmlContent) {
    if (!this.feed) return;

    const card = document.createElement('div');
    if (sender === 'user') {
      card.className = 'bg-cyan-950/70 border border-cyan-800/80 rounded-xl p-3 text-cyan-200 text-xs ml-4 shadow-sm';
      card.innerHTML = `<div class="font-bold text-[10px] text-cyan-400 uppercase tracking-wider mb-1">SEN:</div><div class="leading-relaxed">${htmlContent}</div>`;
    } else {
      card.className = 'bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-300 text-xs space-y-2 leading-relaxed shadow-sm';
      card.innerHTML = htmlContent;
    }

    this.feed.appendChild(card);
    
    // Auto scroll strictly to the bottom
    requestAnimationFrame(() => {
      this.feed.scrollTop = this.feed.scrollHeight;
    });

    // Render KaTeX for any math blocks inside the card
    this.renderMathInCard(card);
    lucide.createIcons();
  }

  renderMathInCard(container) {
    if (typeof renderMathInElement === 'function') {
      try {
        renderMathInElement(container, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn('Auto-render math error:', e);
      }
    }
  }

  async explainFormulaDeeply(formula) {
    const cardId = 'formula-deep-' + Date.now();
    const html = `
      <div id="${cardId}" class="space-y-3">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">${formula.category}</span>
          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">${formula.badge}</span>
        </div>
        <h3 class="text-sm font-bold text-white">${formula.title}</h3>
        <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-serif text-emerald-300 text-center text-base formula-deep-display"></div>
        <div class="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] flex items-center justify-between">
          <span class="text-slate-400 font-semibold">Boyut Analizi:</span>
          <span class="font-mono text-cyan-400">${formula.dimensional || 'Standart SI'}</span>
        </div>
        
        <div class="formula-ai-response-box bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-2">
          <div class="flex items-center gap-2 text-purple-300 font-semibold text-xs border-b border-purple-500/20 pb-1.5">
            <i data-lucide="bot" class="w-4 h-4 text-purple-400"></i>
            <span>LazalBot Fizik Sezgisi & Derin Analiz</span>
          </div>
          <div class="formula-ai-content text-slate-300 leading-relaxed space-y-2">
            <div class="flex items-center gap-2 text-purple-400 py-1">
              <div class="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span>LazalBot teoriyi ve evrendeki derin anlamını inceliyor...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.appendCard('assistant', html);

    const cardEl = document.getElementById(cardId);
    if (cardEl) {
      const formulaDiv = cardEl.querySelector('.formula-deep-display');
      if (formulaDiv && typeof window.renderMath === 'function') {
        window.renderMath(formulaDiv, formula.katex, true);
      }
      if (window.lucide) {
        lucide.createIcons({ root: cardEl });
      }
    }

    this.feed.scrollTop = this.feed.scrollHeight;

    // AI Query specifically for this formula
    const userPrompt = `Çalışma masasındaki "${formula.title}" ($${formula.katex}$) formülü için "Fizik Sezgisi" istendi. Bu formülün arkasındaki fiziksel sezgiyi ve evrendeki anlamını derinlemesine açıklar mısın?`;
    
    const unlockedQuantities = window.appState ? Array.from(window.appState.unlockedQuantities).join(', ') : 'Temel büyüklükler';
    const systemPrompt = `Sen 'LazalBot' adında, 'lazaloglucafizik' platformunun baş kuramsal ve deneysel fizikçisisin. Richard Feynman ve Lev Landau tarzında; derin fiziksel sezgiye, matematiksel titizliğe sahip, aynı zamanda kullanıcıyla derin fiziksel ve felsefi tartışmalara girebilen gerçek bir yapay zekasın. Senin adın LazalBot.

Kullanıcı az önce bir formülün "Fizik Sezgisi" butonuna tıkladı:
- Formül: ${formula.title}
- Bağıntı: $${formula.katex}$
- Kategori: ${formula.category}
- Boyut: ${formula.dimensional || 'Standart SI'}
- Masada açık büyüklükler: ${unlockedQuantities}

Görevin:
1. Bu formülün doğada gerçekte neyi temsil ettiğini, günlük yaşam veya evrenden çarpıcı, zihin açıcı bir analojiyle anlat (Feynman tarzı).
2. Değişkenlerin birbirini nasıl etkilediğini, aşırı sınırlarda (limit durumlar: hız ışık hızına yaklaşırsa, sıcaklık mutlak sıfıra inerse, kütle sonsuza giderse vb.) neler olduğunu açıkla.
3. Formülü korunum yasaları (enerji, momentum, kütle vb.) veya simetrilerle ilişkilendir.
4. Formül ve sembolleri KaTeX ($...$ ve $$...$$) formatında yaz.
5. Samimi, heyecan verici, derin ve akıcı bir Türkçe kullan (2-3 kısa paragraf).`;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    };

    let replyText = await this.executeGeminiRequest(payload);

    if (cardEl) {
      const contentEl = cardEl.querySelector('.formula-ai-content');
      if (contentEl) {
        if (replyText) {
          let formatted = replyText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');

          contentEl.innerHTML = `<div class="ai-text leading-relaxed text-slate-200">${formatted}</div>`;
          this.renderLatexInContainer(contentEl);

          // Add to chat history so user can follow up
          this.chatHistory.push({ role: 'user', parts: [{ text: userPrompt }] });
          this.chatHistory.push({ role: 'model', parts: [{ text: replyText }] });
          if (this.chatHistory.length > 16) {
            this.chatHistory = this.chatHistory.slice(-16);
          }
        } else {
          // Fallback to offline pre-written intuition
          contentEl.innerHTML = `
            <p class="text-slate-300 leading-relaxed">${formula.intuition || formula.description}</p>
          `;
          this.renderLatexInContainer(contentEl);
        }
      }
    }

    this.feed.scrollTop = this.feed.scrollHeight;
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
        <p>Elinde açık olan <strong>${q1.name} (${q1.symbol})</strong> ile <strong>${q2.name} (${q2.symbol})</strong> büyüklükleri arasında doğanın çok önemli bir kanunu gizli!</p>
        <p class="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
          Bu ikisini masada birbirinin üzerine bırakarak <strong>${candidate.category}</strong> alanında yeni bir formül açabilirsin.
        </p>
      `);
    } else {
      this.appendCard('assistant', `
        <div class="font-bold text-emerald-400">Harika İlerleme!</div>
        <p>Açık büyüklüklerinle temel kanunların birçoğunu sentezledin! Şimdi oluşan formül kartlarının üzerine yeni büyüklükler sürükleyerek (örneğin $F = ma$ kartına $x$ sürükleyerek) zincirleme reaksiyonları dene.</p>
      `);
    }
  }

  explainScalarVsVector() {
    this.appendCard('assistant', `
      <div class="font-bold text-white flex items-center gap-1.5">
        <i data-lucide="compass" class="w-4 h-4 text-rose-400"></i> Skaler ve Vektörel Ayrımı
      </div>
      <p>🔵 <strong>Skaler Büyüklükler:</strong> Yalnızca sayısal değer ve birimle ifade edilir (Kütle $m$, Sıcaklık $T$, Enerji $W$, Zaman $t$). Yönleri yoktur.</p>
      <p>🔴 <strong>Vektörel Büyüklükler:</strong> Sayı ve birimin yanında yön ve doğrultu içerir (Kuvvet $\\vec{F}$, Hız $\\vec{v}$, İvme $\\vec{a}$, Momentum $\\vec{p}$).</p>
      <p class="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
        💡 <em>Fiziksel İlke: İki vektörün skaler (nokta) çarpımı skaler bir skaler nicelik (İş / Enerji: $W = \\vec{F} \\cdot \\vec{x}$), vektörel (çapraz) çarpımı ise yeni bir vektör (Tork: $\\vec{\\tau} = \\vec{r} \\times \\vec{F}$) doğurur!</em>
      </p>
    `);
  }

  async handleUserPrompt(userText) {
    this.appendCard('user', userText);
    await this.callGeminiAPI(userText);
  }

  async callGeminiAPI(userText) {
    const loadingId = 'ai-loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingId && (loadingDiv.id = loadingId);
    loadingDiv.className = 'bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-slate-400 text-xs flex items-center gap-2';
    loadingDiv.innerHTML = `
      <div class="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      <span>LazalBot teoriyi inceliyor...</span>
    `;
    this.feed.appendChild(loadingDiv);
    this.feed.scrollTop = this.feed.scrollHeight;

    const unlockedQuantities = window.appState ? Array.from(window.appState.unlockedQuantities).join(', ') : 'Temel büyüklükler';
    const systemPrompt = `Sen 'LazalBot' adında, 'lazaloglucafizik' platformunun baş kuramsal ve deneysel fizikçisisin. Richard Feynman ve Lev Landau tarzında; derin fiziksel sezgiye, matematiksel titizliğe sahip, aynı zamanda kullanıcıyla derin fiziksel ve felsefi tartışmalara (örneğin kuantum mekaniği yorumları, görelilik paradoksları, termodinamiğin yönü, sicim teorisi, kara delikler ve kozmoloji) girebilen gerçek bir yapay zekasın. Senin adın LazalBot.

Görev ve Kuralların:
1. Adın LazalBot; kullanıcının sorusu veya selamı olursa LazalBot olarak yanıt ver.
2. Kullanıcıyla derinlemesine fizik tartışmaları yap. Sorularına basmakalıp laflar yerine mekanizmanın neden ve nasıl çalıştığını anlat.
3. Formülleri KaTeX formatında yaz: Satır içi formüller için $...$, blok formüller için $$...$$ kullan (örneğin $F = ma$, $E = mc^2$, $\\nabla \\times \\vec{B} = \\mu_0 \\vec{J}$).
4. Kullanıcının platformda açtığı büyüklükleri göz önünde bulundur: ${unlockedQuantities}.
5. Tartışmalarda boyut analizi, enerji korunumu, simetriler (Noether teoremi) gibi temel ilkeleri kullan.
6. Samimi, enerjik, bilimsel olarak ödün vermeyen, açık ve anlaşılır bir Türkçe kullan.`;

    // Append to conversation history (keep last 16 messages)
    this.chatHistory.push({ role: 'user', parts: [{ text: userText }] });
    if (this.chatHistory.length > 16) {
      this.chatHistory = this.chatHistory.slice(-16);
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: this.chatHistory
    };

    const replyText = await this.executeGeminiRequest(payload);
    document.getElementById(loadingId)?.remove();

    if (replyText) {
      this.chatHistory.push({ role: 'model', parts: [{ text: replyText }] });

      // Clean markdown bold and paragraphs
      let formatted = replyText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

      this.appendCard('assistant', formatted);
    } else {
      this.respondOffline(userText);
    }
  }

  async executeGeminiRequest(payload) {
    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    for (const model of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
          }
        }
      } catch (err) {
        console.warn(`Model ${model} request failed:`, err);
      }
    }
    return null;
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
      <p>Sorunu fiziksel ilkelerle değerlendirelim:</p>
      <p>Doğadaki tüm türetilmiş kanunlar temel büyüklüklerin ($m, x, t, I, T, n, I_v$) korunum ilkeleri ve simetrileri üzerinden kurulur.</p>
      <p>Örneğin masadaki bir formülün (örn: <strong>$F = ma$</strong>) üzerine başka bir büyüklük (örn: <strong>Mesafe $x$</strong>) sürükleyerek daha üst düzey kanunları (örn: <strong>$W = F \\cdot x$</strong>) zincirleme sentezleyebilirsin!</p>
    `);
  }
}

window.aiAssistant = new AIAssistant();
