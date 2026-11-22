# ⚛️ Fizik Simyası (Physics Alchemy)

Fizik ve matematikteki temel **skaler ve vektörel büyüklükleri** serbest çalışma masasında birbirinin veya diğer formüllerin üzerine sürükleyip bırakarak doğanın kabul gören formüllerini sentezlediğin, canlı Vikipedi makaleleri ve derin fizik sezgisiyle öğrendiğin modern interaktif laboratuvar uygulaması.

---

## 🌟 Öne Çıkan Özellikler

1. **Serbest Çalışma Masası (Blueprint Dot-Grid Canvas):**
   - Hantal yuvalar yerine Dieter Rams ve Linear sadeliğinde serbest çalışma alanı.
   - İster iki büyüklüğü (örn. $m$ ile $\vec{a}$), ister **bir büyüklüğü var olan bir formülün üzerine** (örn. $x$'i $F = ma$ kartının üzerine) sürükleyip birleştirebilme.
   - Manyetik çekim bağı (SVG animasyonlu çizgi) ve anlık reaksiyon önizleme HUD'ı.
   - Formülü bileşenlerine ayrıştırabilme (**⤢**) ve dilediğin gibi taşıyabilme.

2. **Kusursuz KaTeX Matematik Dizgisi:**
   - Tüm formüller kristal netliğinde KaTeX LaTeX motoruyla akademik standartta render edilir.

3. **Canlı Vikipedi & Sezgi Motoru:**
   - Her formül kartında tek tıkla açılan zarif Vikipedi yan paneli.
   - Formülün boyut analizini (`[M][L]²[T]⁻²`) ve günlük hayattaki sezgisel karşılığını açıklayan modül.
   - Dileyenler için Google Gemini API entegrasyonu.

4. **Formül Defteri (Codex):**
   - Keşfedilen tüm kanunların arşivi ve yerel hafıza (`localStorage`) ile otomatik ilerleme kaydı.

---

## 🚀 Yerel Olarak Çalıştırma

### Yöntem 1 (Kuruluma gerek yok):
Klasördeki `index.html` dosyasına çift tıklayarak doğrudan Chrome veya Edge'de açabilirsiniz.

### Yöntem 2 (Yerel Sunucu ile):
```bash
node server.js
```
Ardından tarayıcınızdan **`http://localhost:3000`** adresine gidin.

---

## ☁️ Vercel Dağıtımı (Deployment)

Proje Vercel için tam optimize edilmiştir (`vercel.json` ve `package.json` hazırdır).

### 1. Vercel CLI ile Anında Dağıtım:
Terminalde proje dizinindeyken:
```bash
npx vercel
```
*(İlk seferde Vercel hesabınıza giriş yapmanızı isteyecektir. Tüm soruları varsayılan olarak `Enter` ile geçebilirsiniz).*

Canlıya almak için:
```bash
npx vercel --prod
```

### 2. GitHub Üzerinden Vercel Dağıtımı:
1. GitHub'da yeni bir repo oluşturun (örn: `fizik-simyasi`).
2. Terminalden yerel reponuzu bağlayıp pushlayın:
   ```bash
   git remote add origin https://github.com/KULLANICI_ADINIZ/fizik-simyasi.git
   git push -u origin main
   ```
3. [vercel.com](https://vercel.com) adresine gidin, **"Add New Project"** diyerek GitHub reponuzu seçin ve **Deploy** butonuna basın. Birkaç saniye içinde global CDN üzerinden siteniz yayına girecektir!
