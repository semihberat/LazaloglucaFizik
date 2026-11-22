# ⚛️ Fizik Simyası (Physics Alchemy)

Fizik ve matematikteki temel **skaler ve vektörel büyüklükleri** sürükle-bırak (Drag & Drop) mantığıyla birleştirerek evrenin kabul gören fizik formüllerini keşfettiğin, Vikipedi makaleleriyle derinleştiğin ve **Yapay Zeka (AI) Fizik Öğretmeni** desteğiyle öğrendiğin modern bir web uygulaması.

---

## 🌟 Öne Çıkan Özellikler

1. **Skaler & Vektörel Büyüklük Paleti:**
   - Kütle, Zaman, Uzunluk, Hız, İvme, Kuvvet, Enerji, Güç, Gerilim, Akım, Direnç, vb.
   - Büyüklüklerin **Skaler (Mavi)** ve **Vektörel (Kırmızı)** olduğunu gösteren net renk kodlaması ve filtreler.
   - SI Birimleri, semboller ve Boyut Analizi (örneğin: `[M][L][T]⁻²`).
   - Hızlı arama ve kategori filtreleme (Kinematik, Dinamik, Elektromanyetizma, vb.).

2. **Sentez Tezgahı (Drag & Drop Mekaniği):**
   - Büyüklük kartlarını doğrudan sürükleyip yuvalara bırakabilir veya karta tıklayarak masaya yerleştirebilirsiniz.
   - İşlem seçimi: **Çarpma ($\times$)**, **Bölme ($\div$)** veya **Otomatik Sentez ($\rightleftharpoons$)**.
   - Doğru bir fiziksel bağıntı yakalandığında:
     - 🎊 Konfeti patlaması
     - 🎵 Web Audio API ile üretilmiş zafer sesi (sıfır harici dosya bağımlılığı)
     - 📐 KaTeX ile kusursuz LaTeX matematiksel formül kartı
     - 🔓 Yeni türetilmiş büyüklüklerin kilidinin açılması!

3. **Canlı Vikipedi Entegrasyonu:**
   - Keşfedilen her formül ve büyüklük kartında yer alan **"Vikipedi'de İncele"** butonu.
   - Vikipedi REST API üzerinden anında Türkçe makale özeti, görseli ve doğrudan tam makale bağlantısı.

4. **Yapay Zeka (AI) Fizik Asistanı:**
   - **Çift Motorlu Yapı:**
     - 🧠 **Google Gemini API Desteği:** Ayarlardan kendi Gemini API anahtarını ekleyerek gerçek zamanlı yapay zeka ile sınırsız fizik sohbeti.
     - ⚡ **Dahili Akıllı Heuristik Fizikçi:** API anahtarı olmadan da elindeki büyüklüklere göre bir sonraki mantıklı birleşimi öneren akıllı ipucu motoru!
   - Tek tıkla: "💡 Bir Sonraki İpucu", "🔬 Son Formülü Açıkla", "📐 Skaler vs Vektör Nedir?".

5. **Formül Defteri (Codex):**
   - Keşfettiğin tüm formülleri kaydeden ve henüz keşfedilmemiş olanları soru işaretiyle gösteren kütüphane.
   - İlerleme durumu (Örn: `12 / 20 Keşfedildi`) ve ilerleme çubuğu.
   - LocalStorage ile otomatik kayıt (tarayıcıyı kapatsan bile ilerlemen kaybolmaz).

---

## 🚀 Nasıl Çalıştırılır?

### Yöntem 1: Doğrudan Tarayıcıda Açma (En Basit)
Herhangi bir kurulum yapmadan doğrudan klasördeki `index.html` dosyasına çift tıklayarak Chrome, Edge, Brave veya Firefox üzerinde açabilirsiniz!

### Yöntem 2: Node.js ile Yerel Sunucu Başlatma
Terminal veya PowerShell üzerinden:
```powershell
node server.js
```
Ardından tarayıcınızdan **`http://localhost:3000`** adresine gidin.

---

## 🧪 Bazı Başlangıç Reçeteleri (İpuçları)

- **Mesafe ($x$)** $\div$ **Zaman ($t$)** $\rightarrow$ **Sürat / Hız ($v$)**
- **Hız ($v$)** $\div$ **Zaman ($t$)** $\rightarrow$ **İvme ($a$)**
- **Kütle ($m$)** $\times$ **İvme ($a$)** $\rightarrow$ **Kuvvet ($F$)** *(Newton'un II. Yasası)*
- **Kütle ($m$)** $\times$ **Yerçekimi İvmesi ($g$)** $\rightarrow$ **Ağırlık ($G$)**
- **Kuvvet ($F$)** $\times$ **Mesafe ($x$)** $\rightarrow$ **İş / Enerji ($W$)**
- **İş ($W$)** $\div$ **Zaman ($t$)** $\rightarrow$ **Güç ($P$)**
- **Kütle ($m$)** $\times$ **Işık Hızı ($c$)** $\rightarrow$ **$E = mc^2$**
- **Elektrik Akımı ($I$)** $\times$ **Zaman ($t$)** $\rightarrow$ **Elektrik Yükü ($q$)**
- **Gerilim ($V$)** $\div$ **Akım ($I$)** $\rightarrow$ **Direnç ($R$)** *(Ohm Kanunu)*
