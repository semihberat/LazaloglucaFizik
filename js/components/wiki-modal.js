/**
 * Wikipedia Slide-over Inspector Component
 * Fetches Wikipedia REST API summaries and displays in a sleek side drawer
 */

class WikiModalManager {
  constructor() {
    this.modal = document.getElementById('wikiModal');
    this.modalTitle = document.getElementById('wikiModalTitle');
    this.modalSubtitle = document.getElementById('wikiModalSubtitle');
    this.modalBody = document.getElementById('wikiModalBody');
    this.modalExternalLink = document.getElementById('wikiModalExternalLink');
    this.closeBtn = document.getElementById('closeWikiModalBtn');

    this.initEvents();
  }

  initEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  async openFor(query, fallbackTitle = '') {
    if (!query) return;

    this.modal.classList.remove('hidden');
    setTimeout(() => {
      this.modal.classList.remove('opacity-0');
      const drawer = this.modal.querySelector('div');
      if (drawer) drawer.classList.remove('translate-x-full');
    }, 10);

    this.modalTitle.textContent = fallbackTitle || query;
    this.modalSubtitle.textContent = 'Vikipedi makalesi yükleniyor...';
    this.modalBody.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
        <div class="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs">Vikipedi verisi getiriliyor...</p>
      </div>
    `;

    try {
      let url = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      let res = await fetch(url);
      let data = null;

      if (res.ok) {
        data = await res.json();
      }

      if (!data || data.type === 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') {
        const enQuery = this.mapToEnQuery(query);
        const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(enQuery)}`;
        const enRes = await fetch(enUrl);
        if (enRes.ok) data = await enRes.json();
      }

      if (data && data.extract) {
        this.renderWikiContent(data);
      } else {
        this.renderFallback(query, fallbackTitle);
      }
    } catch (err) {
      console.warn('Wiki fetch error:', err);
      this.renderFallback(query, fallbackTitle);
    }
  }

  renderWikiContent(data) {
    this.modalTitle.textContent = data.title;
    this.modalSubtitle.textContent = data.description || 'Vikipedi Özgür Ansiklopedi';
    
    const pageUrl = data.content_urls?.desktop?.page || `https://tr.wikipedia.org/wiki/${encodeURIComponent(data.title)}`;
    this.modalExternalLink.href = pageUrl;

    let imageHtml = '';
    if (data.thumbnail && data.thumbnail.source) {
      imageHtml = `
        <div class="float-right ml-4 mb-3 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <img src="${data.thumbnail.source}" alt="${data.title}" class="max-w-[140px] max-h-[140px] rounded-lg object-contain bg-slate-950">
        </div>
      `;
    }

    this.modalBody.innerHTML = `
      <div class="clearfix leading-relaxed text-slate-300">
        ${imageHtml}
        <p class="text-sm font-normal mb-4">${data.extract}</p>
      </div>
      <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
        💡 <strong>Not:</strong> Formülün detaylı matematiksel ispatları, tarihçesi ve türev bağıntıları için aşağıdaki butondan tam Vikipedi makalesini inceleyebilirsiniz.
      </div>
    `;

    lucide.createIcons();
  }

  renderFallback(query, fallbackTitle) {
    const searchUrl = `https://tr.wikipedia.org/wiki/Özel:Ara?search=${encodeURIComponent(query)}`;
    this.modalTitle.textContent = fallbackTitle || query;
    this.modalSubtitle.textContent = 'Vikipedi Arama';
    this.modalExternalLink.href = searchUrl;

    this.modalBody.innerHTML = `
      <div class="p-6 text-center space-y-3">
        <p class="text-sm text-slate-300">
          <strong>"${query}"</strong> konusundaki makaleye doğrudan Vikipedi üzerinden erişebilirsiniz.
        </p>
      </div>
    `;
    lucide.createIcons();
  }

  close() {
    this.modal.classList.add('opacity-0');
    const drawer = this.modal.querySelector('div');
    if (drawer) drawer.classList.add('translate-x-full');
    setTimeout(() => {
      this.modal.classList.add('hidden');
    }, 200);
  }

  mapToEnQuery(trQuery) {
    const map = {
      'Kütle': 'Mass',
      'Uzunluk': 'Length',
      'Yer değiştirme': 'Displacement_(vector)',
      'Zaman': 'Time',
      'Elektrik akımı': 'Electric_current',
      'Sıcaklık': 'Temperature',
      'Işık hızı': 'Speed_of_light',
      'Yerçekimi ivmesi': 'Standard_gravity',
      'Sürat': 'Speed',
      'Hız': 'Velocity',
      'İvme': 'Acceleration',
      'Kuvvet': 'Force',
      'Ağırlık': 'Weight',
      'İş (fizik)': 'Work_(physics)',
      'Güç (fizik)': 'Power_(physics)',
      'Basınç': 'Pressure',
      'Özkütle': 'Density',
      'Momentum': 'Momentum',
      'İtme': 'Impulse_(physics)',
      'Kinetik enerji': 'Kinetic_energy',
      'Potansiyel enerji': 'Potential_energy',
      'Ohm kanunu': "Ohm's_law",
      'Kütle-enerji eşdeğerliği': 'Mass–energy_equivalence',
      'Tork': 'Torque',
      'Frekans': 'Frequency',
      'Dalga boyu': 'Wavelength'
    };
    return map[trQuery] || trQuery;
  }
}

window.wikiModalManager = new WikiModalManager();
