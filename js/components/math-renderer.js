/**
 * KaTeX Mathematical Formula Renderer
 * Guarantees reliable LaTeX rendering with queueing and retry mechanisms
 */

(function () {
  const pendingRenders = [];
  let isKatexReady = false;

  function checkKatexReady() {
    if (typeof window.katex !== 'undefined') {
      isKatexReady = true;
      flushPending();
      return true;
    }
    return false;
  }

  function flushPending() {
    while (pendingRenders.length > 0) {
      const item = pendingRenders.shift();
      doRender(item.element, item.latex, item.displayMode);
    }
  }

  function doRender(element, latex, displayMode) {
    if (!element || !latex) return;
    try {
      window.katex.render(latex, element, {
        displayMode: displayMode,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
      element.classList.remove('math-loading');
    } catch (err) {
      console.warn('KaTeX render error:', err);
      element.textContent = latex;
    }
  }

  window.renderMath = function (element, latex, displayMode = true) {
    if (!element) return;
    if (!latex) {
      element.innerHTML = '';
      return;
    }

    // Clean up LaTeX string if needed
    const cleanLatex = latex.trim();

    if (checkKatexReady()) {
      doRender(element, cleanLatex, displayMode);
    } else {
      element.classList.add('math-loading');
      element.innerHTML = `<span class="opacity-50 font-serif">${cleanLatex}</span>`;
      pendingRenders.push({ element, latex: cleanLatex, displayMode });
    }
  };

  // Poll until KaTeX is ready if it loaded asynchronously
  let checkInterval = setInterval(() => {
    if (checkKatexReady()) {
      clearInterval(checkInterval);
    }
  }, 50);

  // Stop polling after 8 seconds
  setTimeout(() => clearInterval(checkInterval), 8000);

  window.addEventListener('load', () => {
    checkKatexReady();
    // Render any elements with data-latex attribute
    document.querySelectorAll('[data-latex]').forEach(el => {
      window.renderMath(el, el.dataset.latex, el.dataset.displayMode !== 'false');
    });
  });
})();
