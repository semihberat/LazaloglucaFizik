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
    this.lastApiError = null;

    this.initEvents();
    this.updateStatus();
  }

  initEvents() {
    if (this.closeBtn && this.drawer) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.drawer.classList.add('hidden');
        this.drawer.classList.remove('flex');
        this.drawer.style.display = 'none';
        if (window.soundManager) window.soundManager.playPop();
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

    const quantumBtn = document.getElementById('aiQuantumBtn');
    if (quantumBtn) {
      quantumBtn.addEventListener('click', () => {
        this.handleUserPrompt("Enerji ve momentum korunumu ile doğadaki simetriler (Noether teoremi) arasındaki ilişkiyi açıklar mısın?");
      });
    }

    const clearChatBtn = document.getElementById('clearChatHistoryBtn');
    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        this.chatHistory = [];
        this.feed.innerHTML = `
          <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-slate-300 space-y-2.5 leading-relaxed shadow-sm select-text">
            <p class="font-bold text-white flex items-center gap-1.5 text-xs">
              <i data-lucide="atom" class="w-4 h-4 text-cyan-400"></i> LazalBot Fizik Laboratuvarı Sezgi Motoru
            </p>
            <p class="text-xs text-slate-300">Sohbet sıfırlandı. Masadaki büyüklükleri veya formülleri birleştirerek yeni bağıntılar üretebilir veya doğrudan sorularını sorabilirsin.</p>
            <div class="text-[11px] text-slate-400 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
              <i data-lucide="info" class="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5"></i>
              <span>Herhangi bir formülün üzerindeki <strong>"Fizik Sezgisi"</strong> butonuna basarak <strong>LazalBot</strong>'un derin boyut analizini, evren analojilerini ve sınır durum yorumlarını canlı olarak alabilirsin.</span>
            </div>
          </div>
        `;
        if (window.lucide) lucide.createIcons({ root: this.feed });
      });
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
        this.appendCard('assistant', '<i data-lucide="sparkles" class="w-4 h-4 text-purple-400 inline mr-1"></i><strong>LazalBot Fizik Mentörü Hazır!</strong> Artık her türlü fizik teorisi, paradoks ve matematiksel bağıntıyı tartışabiliriz.');
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

  updateStatus(statusType = null) {
    if (!this.statusText) return;

    const errorState = statusType || this.lastApiError;

    if (errorState === 'QUOTA_EXCEEDED') {
      this.statusText.textContent = '● Demo Kotası Doldu (Anahtar Ekle)';
      this.statusText.className = 'text-[10px] text-amber-400 font-medium cursor-pointer hover:underline';
      this.statusText.title = 'Ücretsiz demo kotası doldu. Tıklayarak kendi Google Gemini API anahtarını ekleyebilirsin.';
      this.statusText.onclick = () => {
        const modal = document.getElementById('aiSettingsModal');
        if (modal) {
          modal.classList.remove('hidden');
          setTimeout(() => modal.classList.remove('opacity-0'), 10);
        }
      };
      return;
    }

    if (errorState === 'INVALID_KEY') {
      this.statusText.textContent = '● Geçersiz API Anahtarı';
      this.statusText.className = 'text-[10px] text-rose-400 font-medium cursor-pointer hover:underline';
      this.statusText.onclick = () => {
        const modal = document.getElementById('aiSettingsModal');
        if (modal) {
          modal.classList.remove('hidden');
          setTimeout(() => modal.classList.remove('opacity-0'), 10);
        }
      };
      return;
    }

    const hasCustomKey = !!localStorage.getItem('physics_alchemy_gemini_key');
    this.statusText.textContent = hasCustomKey ? '● Özel Çekirdek Aktif' : '● Çevrimiçi';
    this.statusText.className = 'text-[10px] text-emerald-400 font-medium';
    this.statusText.onclick = null;
  }

  appendCard(sender, content, rawText = null) {
    if (!this.feed) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const card = document.createElement('div');
    card.className = 'chat-msg-card transition-all duration-200 select-text';

    if (sender === 'user') {
      const cleanText = (typeof content === 'string') ? content : '';
      card.innerHTML = `
        <div class="bg-gradient-to-r from-slate-900 to-cyan-950/70 border border-cyan-500/30 rounded-2xl rounded-tr-sm p-3.5 text-cyan-100 text-xs ml-4 shadow-sm select-text">
          <div class="flex items-center justify-between border-b border-cyan-800/40 pb-1.5 mb-2">
            <span class="font-bold text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <i data-lucide="user" class="w-3 h-3"></i> Sen
            </span>
            <span class="text-[10px] text-cyan-400/60 font-mono">${timeStr}</span>
          </div>
          <div class="leading-relaxed whitespace-pre-wrap text-slate-100 select-text">${this.escapeHtml(cleanText)}</div>
        </div>
      `;
    } else {
      const isAlreadyHtml = typeof content === 'string' && (content.startsWith('<div') || content.startsWith('<p') || content.includes('border-'));
      const formattedHtml = isAlreadyHtml
        ? content
        : (typeof window.renderPhysicsMarkdown === 'function' ? window.renderPhysicsMarkdown(content) : content);

      const textToCopy = rawText || content;

      card.innerHTML = `
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-slate-200 text-xs space-y-2.5 leading-relaxed shadow-md select-text">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-md bg-purple-950 border border-purple-600/50 flex items-center justify-center text-purple-400">
                <i data-lucide="bot" class="w-3.5 h-3.5"></i>
              </div>
              <span class="font-bold text-xs text-white">LazalBot</span>
              <span class="text-[9px] text-emerald-400 font-mono bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40">Fizik</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-slate-500 font-mono">${timeStr}</span>
              <button class="copy-msg-btn flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition active:scale-95 border border-slate-700/50" title="Cevabı Kopyala">
                <i data-lucide="copy" class="w-3 h-3"></i>
                <span>Kopyala</span>
              </button>
            </div>
          </div>
          <div class="ai-formatted-content leading-relaxed space-y-2 text-slate-200 text-[13px] select-text">${formattedHtml}</div>
        </div>
      `;

      const copyBtn = card.querySelector('.copy-msg-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(textToCopy);
            copyBtn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i><span class="text-emerald-400 font-medium">Kopyalandı!</span>`;
            if (window.lucide) lucide.createIcons({ root: copyBtn });
            setTimeout(() => {
              copyBtn.innerHTML = `<i data-lucide="copy" class="w-3 h-3"></i><span>Kopyala</span>`;
              if (window.lucide) lucide.createIcons({ root: copyBtn });
            }, 2000);
          } catch (e) {
            console.warn('Clipboard write error:', e);
          }
        });
      }
    }

    this.feed.appendChild(card);

    // Auto scroll strictly to the bottom
    requestAnimationFrame(() => {
      this.feed.scrollTop = this.feed.scrollHeight;
    });

    if (window.lucide) {
      lucide.createIcons({ root: card });
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const card = document.createElement('div');
    card.className = 'chat-msg-card transition-all duration-200 select-text';
    card.innerHTML = `
      <div id="${cardId}" class="bg-slate-900/95 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-slate-200 text-xs space-y-3 leading-relaxed shadow-md select-text">
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">${formula.category}</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">${formula.badge}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-500 font-mono">${timeStr}</span>
            <button class="copy-msg-btn flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition active:scale-95 border border-slate-700/50" title="Analizi Kopyala">
              <i data-lucide="copy" class="w-3 h-3"></i>
              <span>Kopyala</span>
            </button>
          </div>
        </div>

        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <i data-lucide="sparkles" class="w-4 h-4 text-purple-400"></i>
          <span>${formula.title}</span>
        </h3>

        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-serif text-emerald-300 text-base formula-deep-display"></div>

        <div class="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/90 text-xs flex items-center justify-between">
          <span class="text-slate-400 font-medium">Boyut Analizi:</span>
          <span class="font-mono text-cyan-400 font-semibold">${formula.dimensional || 'Standart SI'}</span>
        </div>
        
        <div class="formula-ai-response-box bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-2">
          <div class="flex items-center gap-2 text-purple-300 font-semibold text-xs border-b border-purple-500/20 pb-1.5">
            <i data-lucide="bot" class="w-4 h-4 text-purple-400"></i>
            <span>LazalBot Fizik Sezgisi & Derin Analiz</span>
          </div>
          <div class="formula-ai-content text-slate-200 leading-relaxed space-y-2 text-[13px] select-text">
            <div class="flex items-center gap-2 text-purple-400 py-1">
              <div class="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span>LazalBot teoriyi ve evrendeki derin anlamını inceliyor...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.feed.appendChild(card);

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
      const copyBtn = cardEl.querySelector('.copy-msg-btn');

      if (contentEl) {
        if (replyText) {
          const formatted = typeof window.renderPhysicsMarkdown === 'function'
            ? window.renderPhysicsMarkdown(replyText)
            : replyText;

          contentEl.innerHTML = `<div class="ai-text leading-relaxed text-slate-200 select-text">${formatted}</div>`;

          // Add to chat history so user can follow up
          this.chatHistory.push({ role: 'user', parts: [{ text: userPrompt }] });
          this.chatHistory.push({ role: 'model', parts: [{ text: replyText }] });
          if (this.chatHistory.length > 16) {
            this.chatHistory = this.chatHistory.slice(-16);
          }

          if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
              try {
                await navigator.clipboard.writeText(`${formula.title} (${formula.badge})\nFormül: ${formula.katex}\nBoyut: ${formula.dimensional}\n\nLazalBot Analizi:\n${replyText}`);
                copyBtn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i><span class="text-emerald-400 font-medium">Kopyalandı!</span>`;
                if (window.lucide) lucide.createIcons({ root: copyBtn });
                setTimeout(() => {
                  copyBtn.innerHTML = `<i data-lucide="copy" class="w-3 h-3"></i><span>Kopyala</span>`;
                  if (window.lucide) lucide.createIcons({ root: copyBtn });
                }, 2000);
              } catch (e) {
                console.warn('Clipboard write error:', e);
              }
            });
          }
        } else {
          // Fallback to offline pre-written intuition
          const fallbackText = formula.intuition || formula.description;
          const formattedFallback = typeof window.renderPhysicsMarkdown === 'function'
            ? window.renderPhysicsMarkdown(fallbackText)
            : fallbackText;
          contentEl.innerHTML = `<p class="text-slate-300 leading-relaxed select-text">${formattedFallback}</p>`;
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
      <p class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span><span><strong>Skaler Büyüklükler:</strong> Yalnızca sayısal değer ve birimle ifade edilir (Kütle $m$, Sıcaklık $T$, Enerji $W$, Zaman $t$). Yönleri yoktur.</span></p>
      <p class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0"></span><span><strong>Vektörel Büyüklükler:</strong> Sayı ve birimin yanında yön ve doğrultu içerir (Kuvvet $\\vec{F}$, Hız $\\vec{v}$, İvme $\\vec{a}$, Momentum $\\vec{p}$).</span></p>
      <div class="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
        <i data-lucide="lightbulb" class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"></i>
        <span><em>Fiziksel İlke: İki vektörün skaler (nokta) çarpımı skaler bir nicelik (İş / Enerji: $W = \\vec{F} \\cdot \\vec{x}$), vektörel (çapraz) çarpımı ise yeni bir vektör (Tork: $\\vec{\\tau} = \\vec{r} \\times \\vec{F}$) doğurur!</em></span>
      </div>
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
      this.appendCard('assistant', replyText, replyText);
    } else {
      this.respondOffline(userText);
    }
  }

  async executeGeminiRequest(payload) {
    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    let quotaHit = false;

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
            this.lastApiError = null;
            this.updateStatus();
            return data.candidates[0].content.parts[0].text;
          }
        } else {
          if (response.status === 429) {
            quotaHit = true;
          }
          console.warn(`Model ${model} returned HTTP ${response.status}`);
        }
      } catch (err) {
        console.warn(`Model ${model} request failed:`, err);
      }
    }

    if (quotaHit) {
      this.lastApiError = 'QUOTA_EXCEEDED';
      this.updateStatus('QUOTA_EXCEEDED');
    }

    return null;
  }

  respondOffline(userText) {
    const text = userText.toLowerCase().trim();
    let responseHtml = '';

    // 1. Casual Greetings & Social Dialogue
    if (/^(naber|nasılsın|nasilsin|selam|merhaba|sa|hey|naptın|nabıyon|nabiyorsun|günaydın|iyi günler|selamlar)/i.test(text)) {
      responseHtml = `
        <p>İyiyim dostum! Laboratuvarda kuantum dalgalanmalarını, evrenin temel korunum ilkelerini ve simetrilerini inceliyordum.</p>
        <p>Sen nasılsın? Masada bugün hangi fizik kanunlarını birleştirip yeni bağıntılar keşfediyoruz?</p>
      `;
    }
    // 2. Identity / Who are you
    else if (text.includes('kimsin') || text.includes('nesin') || text.includes('adın ne') || text.includes('lazalbot kim')) {
      responseHtml = `
        <p>Ben <strong>LazalBot</strong>! <em>lazaloglucafizik</em> platformunun teorik ve deneysel fizik mentörüyüm.</p>
        <p>Masandaki büyüklükleri analiz eder, formüllerin arkasındaki derin fiziksel sezgiyi (Feynman yaklaşımıyla) açıklar ve evrenin işleyişine dair her türlü teorik tartışmayı yürütürüm.</p>
      `;
    }
    // 3. Hints & Guidance
    else if (text.includes('ipucu') || text.includes('ne yap') || text.includes('yardım') || text.includes('tıkandım')) {
      this.generateHint();
      return;
    }
    // 4. Scalar vs Vector
    else if (text.includes('skaler') || text.includes('vektör')) {
      this.explainScalarVsVector();
      return;
    }
    // 5. Quantum Mechanics
    else if (text.includes('kuantum') || text.includes('schrödinger') || text.includes('heisenberg') || text.includes('foton') || text.includes('dalga')) {
      responseHtml = `
        <div class="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
          <i data-lucide="atom" class="w-4 h-4"></i> Kuantum Dünyası & Belirsizlik
        </div>
        <p>Kuantum mekaniğinde parçacıklar aynı zamanda dalga karakteri taşır. <strong>Heisenberg Belirsizlik İlkesi</strong> der ki; bir parçacığın konumunu ve momentumunu aynı anda kusursuz kesinlikle bilemezsin:</p>
        <div class="p-2 my-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center text-cyan-300 font-mono">
          $$\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$$
        </div>
        <p class="text-slate-300">Bu ölçüm aletlerimizin yetersizliğinden değil; doğanın ve dalga paketlerinin temel matematiksel yapısından kaynaklanır!</p>
      `;
    }
    // 6. Relativity & Einstein
    else if (text.includes('görelilik') || text.includes('relativite') || text.includes('einstein') || text.includes('zaman') || text.includes('ışık hızı')) {
      responseHtml = `
        <div class="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
          <i data-lucide="sparkles" class="w-4 h-4"></i> Özel ve Genel Görelilik
        </div>
        <p>Einstein'ın temel postülasına göre ışık hızı ($c$) evrendeki tüm eylemsiz gözlemciler için sabittir ($c \\approx 3 \\times 10^8 \\text{ m/s}$). Bir cisim hızlandıkça zaman onun için yavaş akar (Zaman Genişlemesi):</p>
        <div class="p-2 my-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center text-amber-300 font-mono">
          $$t' = \\frac{t}{\\sqrt{1 - \\frac{v^2}{c^2}}}$$
        </div>
        <p class="text-slate-300">Ve kütle ile enerji birbirine dönüşebilir: <strong>$E = mc^2$</strong>!</p>
      `;
    }
    // 7. Gravity & Black Holes
    else if (text.includes('kara delik') || text.includes('kütleçekim') || text.includes('yerçekimi') || text.includes('gravitasyon')) {
      responseHtml = `
        <div class="font-bold text-purple-400 flex items-center gap-1.5 mb-1">
          <i data-lucide="disc" class="w-4 h-4"></i> Kütleçekim ve Kara Delikler
        </div>
        <p>Newton'a göre iki kütle birbirini çeker ($F = G\\frac{m_1 m_2}{r^2}$). Einstein ise kütlenin uzay-zaman kumaşını büktüğünü gösterdi.</p>
        <p>Eğer bir kütle kendi <strong>Schwarzschild Yarıçapı</strong> ($r_s = \\frac{2GM}{c^2}$) içine sıkışırsa, kaçış hızı ışık hızını aşar ve ışığın bile kaçamadığı bir kara delik doğar!</p>
      `;
    }
    // 8. Thermodynamics & Entropy
    else if (text.includes('termodinamik') || text.includes('entropi') || text.includes('sıcaklık') || text.includes('ısı')) {
      responseHtml = `
        <div class="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
          <i data-lucide="flame" class="w-4 h-4"></i> Termodinamik & Zamanın Oku
        </div>
        <p>Termodinamiğin 2. Kanunu evrenin yönünü tayin eder: İzole bir sistemin toplam entropisi (düzensizliği) asla azalmaz:</p>
        <div class="p-2 my-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center text-rose-300 font-mono">
          $$\\Delta S \\ge 0$$
        </div>
        <p class="text-slate-300">Bardağın yere düşüp kırılması ve kırıkların kendiliğinden birleşmemesinin nedeni evrenin entropiyi artırma meylidir.</p>
      `;
    }
    // 9. Default Intelligent Fallback
    else {
      const unlockedCount = window.appState ? window.appState.unlockedQuantities.size : 7;
      const discoveredCount = window.appState ? window.appState.discoveredFormulas.size : 0;
      responseHtml = `
        <p>Sorunu fizik ilkeleriyle değerlendirelim:</p>
        <p>Doğadaki tüm türetilmiş kanunlar temel büyüklüklerin ($m, x, t, I, T, n, I_v$) korunum ilkeleri ve simetrileri (Noether Teoremi) üzerinden kurulur.</p>
        <p>Şu an laboratuvarında <strong>${unlockedCount} açık büyüklük</strong> ve <strong>${discoveredCount} keşfedilmiş formül</strong> bulunuyor. Kartları birbirinin üzerine sürükleyerek zincirleme fiziksel sentezler yapabilirsin!</p>
      `;
    }

    // If quota was exceeded, attach transparent warning banner with direct key entry shortcut
    if (this.lastApiError === 'QUOTA_EXCEEDED') {
      responseHtml += `
        <div class="mt-3 pt-2.5 border-t border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between gap-2 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30 select-text">
          <div class="flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-4 h-4 text-amber-400 flex-shrink-0"></i>
            <span>Dahili demo API anahtarının günlük kotası (20 istek) doldu.</span>
          </div>
          <button onclick="const m=document.getElementById('aiSettingsModal');if(m){m.classList.remove('hidden');setTimeout(()=>m.classList.remove('opacity-0'),10);}" 
                  class="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[10px] font-semibold whitespace-nowrap transition active:scale-95 flex items-center gap-1">
            <i data-lucide="key" class="w-3 h-3"></i>
            <span>Anahtar Ekle</span>
          </button>
        </div>
      `;
    }

    this.appendCard('assistant', responseHtml);
  }
}

window.aiAssistant = new AIAssistant();
