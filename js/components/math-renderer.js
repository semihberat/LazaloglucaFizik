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

  /**
   * Synchronously renders a LaTeX string to HTML using KaTeX.
   */
  window.renderLatexToString = function (latex, displayMode = false) {
    if (!latex) return '';
    const clean = latex.trim();
    if (typeof window.katex !== 'undefined') {
      try {
        return window.katex.renderToString(clean, {
          displayMode: displayMode,
          throwOnError: false,
          output: 'htmlAndMathml'
        });
      } catch (e) {
        console.warn('KaTeX renderToString error:', e);
      }
    }
    // Fallback if KaTeX is not loaded yet or failed
    if (displayMode) {
      return `<div class="ai-math-display font-serif">${clean}</div>`;
    }
    return `<span class="ai-math-inline font-serif">${clean}</span>`;
  };

  /**
   * Full markdown + LaTeX parser for AI physics dialogue.
   * Protects math blocks ($...$ and $$...$$), formats markdown, and converts math to real KaTeX elements.
   */
  window.renderPhysicsMarkdown = function (text) {
    if (!text) return '';
    const mathPlaceholders = [];

    // Normalize newlines
    let processed = text.replace(/\r\n/g, '\n');

    // 1. Protect & extract display math: $$...$$ or \[...\]
    processed = processed.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
      let raw = match.trim();
      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        raw = raw.slice(2, -2);
      } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
        raw = raw.slice(2, -2);
      }
      const id = '___MATH_BLOCK_' + mathPlaceholders.length + '___';
      mathPlaceholders.push({ id, raw: raw.trim(), display: true });
      return '\n\n' + id + '\n\n';
    });

    // 2. Protect & extract inline math: $...$ or \(...\)
    processed = processed.replace(/(\$(?!\$)[^\$\n]+?\$|\\\(.+?\\\))/g, (match) => {
      let raw = match.trim();
      if (raw.startsWith('$') && raw.endsWith('$')) {
        raw = raw.slice(1, -1);
      } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
        raw = raw.slice(2, -2);
      }
      const id = '___MATH_BLOCK_' + mathPlaceholders.length + '___';
      mathPlaceholders.push({ id, raw: raw.trim(), display: false });
      return id;
    });

    // 3. Ensure headings, tables, blockquotes and lists have clean paragraph breaks
    processed = processed.replace(/([^\n])\n(#{1,4} )/g, '$1\n\n$2');
    processed = processed.replace(/(#{1,4} [^\n]+)\n([^\n#])/g, '$1\n\n$2');
    processed = processed.replace(/([^\n])\n([*-] )/g, '$1\n\n$2');
    processed = processed.replace(/([^\n])\n(\d+\. )/g, '$1\n\n$2');
    processed = processed.replace(/([^\n])\n(> )/g, '$1\n\n$2');
    processed = processed.replace(/([^\n])\n(\|)/g, '$1\n\n$2');

    // Horizontal Rules
    processed = processed.replace(/^(?:---|___|\*\*\*)$/gm, '\n\n<hr class="my-3 border-slate-800">\n\n');

    // 4. Code blocks
    processed = processed.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const cleanCode = code.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="my-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto shadow-inner"><code>${cleanCode}</code></pre>`;
    });

    // Inline code
    processed = processed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px]">$1</code>');

    // 5. Bold & Italic
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    processed = processed.replace(/(^|[^\*])\*([^\*]+?)\*([^\*]|$)/g, '$1<em class="text-slate-300 italic">$2</em>$3');

    // 6. Headings
    processed = processed.replace(/^### (.+)$/gm, '<h4 class="text-xs font-bold text-emerald-400 mt-3 mb-1 flex items-center gap-1.5">$1</h4>');
    processed = processed.replace(/^## (.+)$/gm, '<h3 class="text-sm font-bold text-white mt-3.5 mb-1.5 flex items-center gap-2">$1</h3>');
    processed = processed.replace(/^# (.+)$/gm, '<h2 class="text-base font-bold text-white mt-4 mb-2 flex items-center gap-2">$1</h2>');

    // 7. Paragraphs, Tables, Blockquotes & Lists
    const isTableSeparator = (line) => {
      if (!line || !line.includes('-')) return false;
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      return parts.length > 0 && parts.every(p => /^:?-+:?$/.test(p));
    };

    const parseTableBlock = (lines) => {
      if (lines.length < 2 || !isTableSeparator(lines[1])) return null;

      const parseRow = (line) => {
        let trimmed = line.trim();
        if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
        if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
        return trimmed.split('|').map(c => c.trim());
      };

      const headers = parseRow(lines[0]);
      const alignParts = parseRow(lines[1]);
      const aligns = alignParts.map(p => {
        const left = p.startsWith(':');
        const right = p.endsWith(':');
        if (left && right) return 'text-center';
        if (right) return 'text-right';
        return 'text-left';
      });

      const bodyRows = lines.slice(2).map(parseRow);

      let html = `<div class="ai-table-wrapper"><table class="ai-table"><thead><tr>`;
      headers.forEach((h, i) => {
        const align = aligns[i] || 'text-left';
        html += `<th class="${align}">${h}</th>`;
      });
      html += `</tr></thead><tbody>`;

      bodyRows.forEach(row => {
        if (!row.some(c => c.length > 0)) return;
        html += `<tr>`;
        headers.forEach((_, i) => {
          const cell = row[i] !== undefined ? row[i] : '';
          const align = aligns[i] || 'text-left';
          html += `<td class="${align}">${cell}</td>`;
        });
        html += `</tr>`;
      });

      html += `</tbody></table></div>`;
      return html;
    };

    const blocks = processed.split(/\n\n+/);
    processed = blocks.map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<pre') || block.startsWith('<div') || block.startsWith('<hr') || block.startsWith('___MATH_BLOCK_')) {
        return block;
      }

      // Blockquotes
      if (block.startsWith('>')) {
        const quoteContent = block.split('\n').map(l => l.replace(/^>\s?/, '')).join('<br>');
        return `<blockquote>${quoteContent}</blockquote>`;
      }

      // Tables
      if (block.includes('|')) {
        const tableLines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const parsedTable = parseTableBlock(tableLines);
        if (parsedTable) return parsedTable;
      }

      // Unordered Lists
      if (/^[*-] /m.test(block)) {
        const items = block.split('\n').filter(line => line.trim()).map(line => {
          const clean = line.replace(/^[*-] /, '').trim();
          return `<li class="text-slate-300 my-0.5">${clean}</li>`;
        }).join('');
        return `<ul class="my-2 space-y-1 text-slate-300">${items}</ul>`;
      }

      // Ordered Lists
      if (/^\d+\.\s/m.test(block)) {
        const items = block.split('\n').filter(line => line.trim()).map(line => {
          const clean = line.replace(/^\d+\.\s+/, '').trim();
          return `<li class="text-slate-300 my-0.5">${clean}</li>`;
        }).join('');
        return `<ol class="my-2 space-y-1 text-slate-300">${items}</ol>`;
      }

      return '<p class="leading-relaxed mb-2 text-slate-200">' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');

    // 8. Re-inject rendered math using real KaTeX HTML!
    for (const item of mathPlaceholders) {
      let rendered = window.renderLatexToString(item.raw, item.display);
      if (item.display) {
        rendered = `<div class="ai-math-display">${rendered}</div>`;
      } else {
        rendered = `<span class="ai-math-inline">${rendered}</span>`;
      }
      processed = processed.replace(item.id, rendered);
    }

    return processed;
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
