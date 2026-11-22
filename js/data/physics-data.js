/**
 * Physics Alchemy - Comprehensive Database of Physical Quantities & Formulas
 * Skaler ve Vektörel büyüklükler, SI birimleri, sembolleri, formül bağıntıları ve zengin fiziksel sezgiler
 */

const PHYSICS_DATA = {
  // 1. PHYSICAL QUANTITIES (BÜYÜKLÜKLER)
  quantities: [
    // TEMEL BÜYÜKLÜKLER (Başlangıçta açık)
    {
      id: 'mass',
      name: 'Kütle',
      symbol: 'm',
      unit: 'kg',
      type: 'scalar',
      dimension: '[M]',
      category: 'Mekanik',
      description: 'Maddenin eylemsizlik ölçüsü ve kütleçekimsel yüküdür. Yönü yoktur, skalerdir.',
      wikiQuery: 'Kütle',
      isDefaultUnlocked: true,
      icon: 'weight'
    },
    {
      id: 'distance',
      name: 'Mesafe / Uzunluk',
      symbol: 'x',
      unit: 'm',
      type: 'scalar',
      dimension: '[L]',
      category: 'Mekanik',
      description: 'Uzamsal iki nokta arasındaki skaler uzaklık veya yol uzunluğudur.',
      wikiQuery: 'Uzunluk',
      isDefaultUnlocked: true,
      icon: 'ruler'
    },
    {
      id: 'displacement',
      name: 'Yer Değiştirme',
      symbol: 'Δx⃗',
      unit: 'm',
      type: 'vector',
      dimension: '[L]',
      category: 'Kinematik',
      description: 'İlk konumdan son konuma çizilen yönlü vektördür. Yön ve büyüklük içerir.',
      wikiQuery: 'Yer değiştirme',
      isDefaultUnlocked: true,
      icon: 'move'
    },
    {
      id: 'time',
      name: 'Zaman',
      symbol: 't',
      unit: 's',
      type: 'scalar',
      dimension: '[T]',
      category: 'Mekanik',
      description: 'Olayların ardışıklığını ölçen skaler temel büyüklüktür.',
      wikiQuery: 'Zaman',
      isDefaultUnlocked: true,
      icon: 'clock'
    },
    {
      id: 'current',
      name: 'Elektrik Akımı',
      symbol: 'I',
      unit: 'A (Amper)',
      type: 'scalar',
      dimension: '[I]',
      category: 'Elektromanyetizma',
      description: 'Birim zamandaki net elektrik yük akış hızıdır. Skaler temel büyüklüktür.',
      wikiQuery: 'Elektrik akımı',
      isDefaultUnlocked: true,
      icon: 'zap'
    },
    {
      id: 'temperature',
      name: 'Sıcaklık',
      symbol: 'T',
      unit: 'K (Kelvin)',
      type: 'scalar',
      dimension: '[Θ]',
      category: 'Termodinamik',
      description: 'Moleküllerin ortalama kinetik enerjisinin skaler bir göstergesidir.',
      wikiQuery: 'Sıcaklık',
      isDefaultUnlocked: true,
      icon: 'thermometer'
    },
    {
      id: 'amount_of_substance',
      name: 'Madde Miktarı',
      symbol: 'n',
      unit: 'mol',
      type: 'scalar',
      dimension: '[N]',
      category: 'Termodinamik',
      description: 'Avogadro sayısı kadar (6.022×10²³) temel tanecik içeren sistemin temel skaler büyüklüğüdür.',
      wikiQuery: 'Mol',
      isDefaultUnlocked: true,
      icon: 'layers'
    },
    {
      id: 'luminous_intensity',
      name: 'Işık Şiddeti',
      symbol: 'Iv',
      unit: 'cd (Kandela)',
      type: 'scalar',
      dimension: '[J]',
      category: 'Optik',
      description: 'Işık kaynağının birim uzay açıda yaydığı ışık gücünün fotometrik ölçüsüdür.',
      wikiQuery: 'Işık şiddeti',
      isDefaultUnlocked: true,
      icon: 'sun'
    },
    {
      id: 'speed_of_light',
      name: 'Işık Hızı',
      symbol: 'c',
      unit: '2.998×10⁸ m/s',
      type: 'constant',
      dimension: '[L][T]⁻¹',
      category: 'Modern Fizik',
      description: 'Evrendeki nedensellik ve elektromanyetik dalga yayılımının evrensel hız sınırıdır.',
      wikiQuery: 'Işık hızı',
      isDefaultUnlocked: true,
      icon: 'sparkles'
    },
    {
      id: 'gravity_accel',
      name: 'Yerçekimi İvmesi',
      symbol: 'g⃗',
      unit: 'm/s²',
      type: 'vector',
      dimension: '[L][T]⁻²',
      category: 'Mekanik',
      description: 'Dünya yüzeyinde kütleçekim alanının serbest düşen cisimlere kazandırdığı vektörel ivmedir.',
      wikiQuery: 'Yerçekimi ivmesi',
      isDefaultUnlocked: true,
      icon: 'arrow-down'
    },

    // KİLİTLİ / TÜRETİLEBİLİR BÜYÜKLÜKLER
    {
      id: 'speed',
      name: 'Sürat',
      symbol: 'v',
      unit: 'm/s',
      type: 'scalar',
      dimension: '[L][T]⁻¹',
      category: 'Kinematik',
      description: 'Birim zamanda alınan yol miktarıdır (Skaler).',
      wikiQuery: 'Sürat',
      isDefaultUnlocked: false,
      icon: 'gauge'
    },
    {
      id: 'velocity',
      name: 'Hız',
      symbol: 'v⃗',
      unit: 'm/s',
      type: 'vector',
      dimension: '[L][T]⁻¹',
      category: 'Kinematik',
      description: 'Birim zamandaki yer değiştirme vektörüdür (Yönlü).',
      wikiQuery: 'Hız',
      isDefaultUnlocked: false,
      icon: 'navigation'
    },
    {
      id: 'acceleration',
      name: 'İvme',
      symbol: 'a⃗',
      unit: 'm/s²',
      type: 'vector',
      dimension: '[L][T]⁻²',
      category: 'Kinematik',
      description: 'Hız vektörünün zamana göre değişim hızıdır (Vektörel).',
      wikiQuery: 'İvme',
      isDefaultUnlocked: false,
      icon: 'trending-up'
    },
    {
      id: 'force',
      name: 'Kuvvet',
      symbol: 'F⃗',
      unit: 'N (Newton)',
      type: 'vector',
      dimension: '[M][L][T]⁻²',
      category: 'Dinamik',
      description: 'Kütleye ivme kazandıran veya şekil değiştiren vektörel etkidir.',
      wikiQuery: 'Kuvvet',
      isDefaultUnlocked: false,
      icon: 'shield'
    },
    {
      id: 'weight',
      name: 'Ağırlık',
      symbol: 'G⃗',
      unit: 'N (Newton)',
      type: 'vector',
      dimension: '[M][L][T]⁻²',
      category: 'Dinamik',
      description: 'Bir cisme yerçekiminin uyguladığı çekim kuvveti vektörüdür (G = m·g).',
      wikiQuery: 'Ağırlık',
      isDefaultUnlocked: false,
      icon: 'anchor'
    },
    {
      id: 'work_energy',
      name: 'İş / Enerji',
      symbol: 'W / E',
      unit: 'J (Joule)',
      type: 'scalar',
      dimension: '[M][L]²[T]⁻²',
      category: 'Enerji',
      description: 'Kuvvetin yol boyunca aktardığı iş yapabilme kapasitesidir. Skalerdir.',
      wikiQuery: 'İş (fizik)',
      isDefaultUnlocked: false,
      icon: 'flame'
    },
    {
      id: 'power',
      name: 'Güç',
      symbol: 'P',
      unit: 'W (Watt)',
      type: 'scalar',
      dimension: '[M][L]²[T]⁻³',
      category: 'Enerji',
      description: 'Birim zamanda harcanan enerji veya yapılan iş hızıdır (P = W / t). Skalerdir.',
      wikiQuery: 'Güç (fizik)',
      isDefaultUnlocked: false,
      icon: 'activity'
    },
    {
      id: 'area',
      name: 'Alan',
      symbol: 'A',
      unit: 'm²',
      type: 'scalar',
      dimension: '[L]²',
      category: 'Geometri',
      description: 'İki boyutlu yüzey yayılımının skaler büyüklüğüdür.',
      wikiQuery: 'Alan (geometri)',
      isDefaultUnlocked: false,
      icon: 'square'
    },
    {
      id: 'volume',
      name: 'Hacim',
      symbol: 'V',
      unit: 'm³',
      type: 'scalar',
      dimension: '[L]³',
      category: 'Geometri',
      description: 'Üç boyutlu uzayda kaplanan skaler hacimdir.',
      wikiQuery: 'Hacim',
      isDefaultUnlocked: false,
      icon: 'box'
    },
    {
      id: 'density',
      name: 'Özkütle',
      symbol: 'ρ',
      unit: 'kg/m³',
      type: 'scalar',
      dimension: '[M][L]⁻³',
      category: 'Madde',
      description: 'Birim hacme düşen kütle miktarıdır (ρ = m / V). Maddeler için ayırt edicidir.',
      wikiQuery: 'Özkütle',
      isDefaultUnlocked: false,
      icon: 'droplets'
    },
    {
      id: 'pressure',
      name: 'Basınç',
      symbol: 'P',
      unit: 'Pa (Paskal)',
      type: 'scalar',
      dimension: '[M][L]⁻¹[T]⁻²',
      category: 'Akışkanlar',
      description: 'Birim yüzeye dik düşen kuvvet yoğunluğudur. Skaler bir alandır.',
      wikiQuery: 'Basınç',
      isDefaultUnlocked: false,
      icon: 'compass'
    },
    {
      id: 'momentum',
      name: 'Momentum',
      symbol: 'p⃗',
      unit: 'kg·m/s',
      type: 'vector',
      dimension: '[M][L][T]⁻¹',
      category: 'Dinamik',
      description: 'Kütlenin hızla çarpımıyla elde edilen vektörel hareket miktarıdır (p = m·v).',
      wikiQuery: 'Momentum',
      isDefaultUnlocked: false,
      icon: 'fast-forward'
    },
    {
      id: 'impulse',
      name: 'İtme (İmpuls)',
      symbol: 'I⃗',
      unit: 'N·s',
      type: 'vector',
      dimension: '[M][L][T]⁻¹',
      category: 'Dinamik',
      description: 'Bir kuvvetin etki ettiği süre boyunca cisme kazandırdığı momentum değişimidir.',
      wikiQuery: 'İtme',
      isDefaultUnlocked: false,
      icon: 'zap-off'
    },
    {
      id: 'electric_charge',
      name: 'Elektrik Yükü',
      symbol: 'q',
      unit: 'C (Coulomb)',
      type: 'scalar',
      dimension: '[I][T]',
      category: 'Elektromanyetizma',
      description: 'Maddenin elektromanyetik alanla etkileşmesini sağlayan temel skaler özelliktir.',
      wikiQuery: 'Elektrik yükü',
      isDefaultUnlocked: false,
      icon: 'disc'
    },
    {
      id: 'voltage',
      name: 'Gerilim (Volt)',
      symbol: 'V',
      unit: 'V (Volt)',
      type: 'scalar',
      dimension: '[M][L]²[T]⁻³[I]⁻¹',
      category: 'Elektromanyetizma',
      description: 'Birim elektrik yükü başına düşen potansiyel enerji farkıdır (V = W / q).',
      wikiQuery: 'Gerilim (elektrik)',
      isDefaultUnlocked: false,
      icon: 'cpu'
    },
    {
      id: 'resistance',
      name: 'Elektriksel Direnç',
      symbol: 'R',
      unit: 'Ω (Ohm)',
      type: 'scalar',
      dimension: '[M][L]²[T]⁻³[I]⁻²',
      category: 'Elektromanyetizma',
      description: 'İletkenin elektrik akımına karşı gösterdiği karşı koymadır (R = V / I).',
      wikiQuery: 'Elektriksel direnç',
      isDefaultUnlocked: false,
      icon: 'sliders'
    },
    {
      id: 'kinetic_energy',
      name: 'Kinetik Enerji',
      symbol: 'Ek',
      unit: 'J (Joule)',
      type: 'scalar',
      dimension: '[M][L]²[T]⁻²',
      category: 'Enerji',
      description: 'Cismin kütlesi ve hızının karesiyle doğru orantılı hareket enerjisidir (Ek = ½·m·v²).',
      wikiQuery: 'Kinetik enerji',
      isDefaultUnlocked: false,
      icon: 'sun'
    },
    {
      id: 'potential_energy',
      name: 'Potansiyel Enerji',
      symbol: 'Ep',
      unit: 'J (Joule)',
      type: 'scalar',
      dimension: '[M][L]²[T]⁻²',
      category: 'Enerji',
      description: 'Yerçekimi alanındaki konumdan kaynaklanan depolanmış durum enerjisidir (Ep = m·g·h).',
      wikiQuery: 'Potansiyel enerji',
      isDefaultUnlocked: false,
      icon: 'mountain'
    },
    {
      id: 'mass_energy',
      name: 'Durgun Kütle Enerjisi',
      symbol: 'E₀',
      unit: 'J (Joule)',
      type: 'scalar',
      dimension: '[M][L]²[T]⁻²',
      category: 'Modern Fizik',
      description: 'Kütlenin enerji eşdeğeridir. Evrendeki en yoğun enerji formudur (E = m·c²).',
      wikiQuery: 'Kütle-enerji eşdeğerliği',
      isDefaultUnlocked: false,
      icon: 'atom'
    },
    {
      id: 'torque',
      name: 'Tork (Dönme Momenti)',
      symbol: 'τ⃗',
      unit: 'N·m',
      type: 'vector',
      dimension: '[M][L]²[T]⁻²',
      category: 'Mekanik',
      description: 'Kuvvetin bir dönme eksenine göre döndürme kabiliyetini ölçen vektörel büyüklüktür.',
      wikiQuery: 'Tork',
      isDefaultUnlocked: false,
      icon: 'rotate-cw'
    },
    {
      id: 'frequency',
      name: 'Frekans',
      symbol: 'f',
      unit: 'Hz (1/s)',
      type: 'scalar',
      dimension: '[T]⁻¹',
      category: 'Dalgalar',
      description: 'Birim zamanda tekrarlanan periyodik salınım sayısıdır (f = 1 / t).',
      wikiQuery: 'Frekans',
      isDefaultUnlocked: false,
      icon: 'radio'
    },
    {
      id: 'wavelength',
      name: 'Dalga Boyu',
      symbol: 'λ',
      unit: 'm',
      type: 'scalar',
      dimension: '[L]',
      category: 'Dalgalar',
      description: 'İki ardışık dalga tepesi veya çukuru arasındaki uzamsal mesafedir.',
      wikiQuery: 'Dalga boyu',
      isDefaultUnlocked: false,
      icon: 'waves'
    },
    {
      id: 'molar_mass',
      name: 'Molar Kütle',
      symbol: 'M',
      unit: 'kg/mol',
      type: 'scalar',
      dimension: '[M][N]⁻¹',
      category: 'Madde & Kimya',
      description: 'Bir maddenin bir molünün kütlesidir (M = m / n).',
      wikiQuery: 'Molar kütle',
      isDefaultUnlocked: false,
      icon: 'box'
    },
    {
      id: 'illuminance',
      name: 'Aydınlanma Şiddeti',
      symbol: 'E_a',
      unit: 'lx (Lüks)',
      type: 'scalar',
      dimension: '[J][L]⁻²',
      category: 'Optik',
      description: 'Birim yüzeye dik düşen ışık akısı miktarıdır (E = Iv / A).',
      wikiQuery: 'Aydınlanma şiddeti',
      isDefaultUnlocked: false,
      icon: 'sun-medium'
    }
  ],

  // 2. FORMULAS & COMBINATIONS (Reçeteler ve Karşılıklı Eşleşmeler)
  formulas: [
    {
      id: 'speed_formula',
      inputs: ['distance', 'time'],
      operation: 'divide', // distance / time
      resultQuantityId: 'speed',
      title: 'Sürat Tanımı',
      katex: 'v = \\frac{x}{t}',
      badge: 'Skaler / Skaler = Skaler',
      category: 'Kinematik',
      description: 'Alınan skaler yolun geçen süreye oranı sürati verir.',
      wikiQuery: 'Sürat',
      intuition: 'Kilometre sayacınızın gösterdiği değer sürattir. Hangi yöne gittiğinizle ilgilenmez, sadece birim zamanda ne kadar yol tükettiğinizi söyler.',
      dimensional: '[L] / [T] = [L][T]⁻¹ (m/s)'
    },
    {
      id: 'velocity_formula',
      inputs: ['displacement', 'time'],
      operation: 'divide', // displacement / time
      resultQuantityId: 'velocity',
      title: 'Hız Vektörü Tanımı',
      katex: '\\vec{v} = \\frac{\\Delta\\vec{x}}{\\Delta t}',
      badge: 'Vektör / Skaler = Vektör',
      category: 'Kinematik',
      description: 'Konumdaki yönlü yer değiştirmenin geçen zamana oranı hız vektörüdür.',
      wikiQuery: 'Hız',
      intuition: 'Hız, süratin aksine yön içerir. "Kuzeye doğru 90 km/s hız" bir hız vektörüdür.',
      dimensional: '[L] / [T] = [L][T]⁻¹ (m/s)'
    },
    {
      id: 'acceleration_formula',
      inputs: ['velocity', 'time'],
      fallbackInputs: ['speed', 'time'],
      operation: 'divide', // v / t
      resultQuantityId: 'acceleration',
      title: 'İvme Tanımı',
      katex: '\\vec{a} = \\frac{\\Delta\\vec{v}}{\\Delta t}',
      badge: 'Vektör / Skaler = Vektör',
      category: 'Kinematik',
      description: 'Hız vektörünün birim zamandaki değişim hızıdır.',
      wikiQuery: 'İvme',
      intuition: 'Arabanın gaz pedalına (hızlanma) ya da frenine (yavaşlama) bastığınızda ivmelenirsiniz. Hatta sabit süratle viraj alırken yön değiştiği için yine ivmelenirsiniz!',
      dimensional: '[L][T]⁻¹ / [T] = [L][T]⁻² (m/s²)'
    },
    {
      id: 'newton_second_law',
      inputs: ['mass', 'acceleration'],
      operation: 'multiply',
      resultQuantityId: 'force',
      title: "Newton'un II. Hareket Kanunu",
      katex: '\\vec{F} = m \\cdot \\vec{a}',
      badge: 'Skaler × Vektör = Vektör',
      category: 'Dinamik',
      description: 'Cisme uygulanan net kuvvet, kütlesi ile kazandığı ivmenin çarpımıdır.',
      wikiQuery: "Newton'un hareket yasaları",
      intuition: 'Klasik fiziğin en büyük sütunudur. Bir nesneye ivme kazandırmak istiyorsanız kuvvet uygulamalısınız; nesne ne kadar ağırsa (kütle), aynı ivmeyi vermek için o kadar fazla kuvvet gerekir.',
      dimensional: '[M] · [L][T]⁻² = [M][L][T]⁻² (Newton, N)'
    },
    {
      id: 'gravity_weight',
      inputs: ['mass', 'gravity_accel'],
      operation: 'multiply',
      resultQuantityId: 'weight',
      title: 'Ağırlık (Yerçekimi Kuvveti)',
      katex: '\\vec{G} = m \\cdot \\vec{g}',
      badge: 'Skaler × Vektör = Vektör',
      category: 'Dinamik',
      description: 'Dünya veya bir gök cisminin bir kütleye uyguladığı kütleçekim kuvvetidir.',
      wikiQuery: 'Ağırlık',
      intuition: 'Kütleniz Ay’da da Dünya’da da aynıdır (70 kg). Ancak Ay’daki yerçekimi ivmesi g daha küçük olduğu için ağırlığınız orada altıda bire düşer.',
      dimensional: '[M] · [L][T]⁻² = [M][L][T]⁻² (Newton)'
    },
    {
      id: 'area_formula',
      inputs: ['distance', 'distance'],
      operation: 'multiply',
      resultQuantityId: 'area',
      title: 'Yüzey Alanı',
      katex: 'A = x_1 \\cdot x_2',
      badge: 'Skaler × Skaler = Skaler',
      category: 'Geometri',
      description: 'İki doğrusal boyutun çarpımı yüzey alanını oluşturur.',
      wikiQuery: 'Alan (geometri)',
      intuition: 'Bir tarlanın eni ile boyunu çarpmak gibi. Uzamsal boyutu 1D’den 2D’ye taşır.',
      dimensional: '[L] · [L] = [L]² (m²)'
    },
    {
      id: 'volume_formula',
      inputs: ['area', 'distance'],
      operation: 'multiply',
      resultQuantityId: 'volume',
      title: 'Hacim Hesabı',
      katex: 'V = A \\cdot x',
      badge: 'Skaler × Skaler = Skaler',
      category: 'Geometri',
      description: 'Yüzey alanı ile derinliğin çarpımı üç boyutlu uzayı tanımlar.',
      wikiQuery: 'Hacim',
      intuition: 'Taban alanı belli bir bardağa su doldurdukça suyun yüksekliğiyle hacim oluşur (3D uzay).',
      dimensional: '[L]² · [L] = [L]³ (m³)'
    },
    {
      id: 'density_formula',
      inputs: ['mass', 'volume'],
      operation: 'divide',
      resultQuantityId: 'density',
      title: 'Özkütle (Yoğunluk)',
      katex: '\\rho = \\frac{m}{V}',
      badge: 'Skaler / Skaler = Skaler',
      category: 'Madde',
      description: 'Birim hacme sığan kütle miktarıdır.',
      wikiQuery: 'Özkütle',
      intuition: 'Demirin suda batıp tahtanın yüzmesi özkütle farkıdır. Atomların birbirine ne kadar sıkı istiflendiğini söyler.',
      dimensional: '[M] / [L]³ = [M][L]⁻³ (kg/m³)'
    },
    {
      id: 'work_formula',
      inputs: ['force', 'distance'],
      fallbackInputs: ['force', 'displacement'],
      operation: 'multiply',
      resultQuantityId: 'work_energy',
      title: 'Mekanik İş ve Enerji',
      katex: 'W = \\vec{F} \\cdot \\Delta\\vec{x}',
      badge: 'Vektör · Vektör = Skaler',
      category: 'Enerji',
      description: 'Kuvvetin doğrultusunda yer değiştirme yaptırması ile cisme enerji aktarılır.',
      wikiQuery: 'İş (fizik)',
      intuition: 'Çok ağır bir duvarı saatlerce itin; duvar kımıldamadığı sürece fizikte sıfır iş yapmış sayılırsınız! İş için mutlaka kuvvet doğrultusunda yer değiştirme şarttır.',
      dimensional: '[M][L][T]⁻² · [L] = [M][L]²[T]⁻² (Joule, J)'
    },
    {
      id: 'power_formula',
      inputs: ['work_energy', 'time'],
      operation: 'divide',
      resultQuantityId: 'power',
      title: 'Mekanik ve Elektriksel Güç',
      katex: 'P = \\frac{W}{t}',
      badge: 'Skaler / Skaler = Skaler',
      category: 'Enerji',
      description: 'Birim zamanda yapılan iş veya dönüştürülen enerjidir.',
      wikiQuery: 'Güç (fizik)',
      intuition: '1000 Joule işi 100 saniyede yapmak 10 Watt güç ister. Aynı işi 1 saniyede yaparsanız 1000 Watt (1 kW) güç üretmiş olursunuz.',
      dimensional: '[M][L]²[T]⁻² / [T] = [M][L]²[T]⁻³ (Watt, W)'
    },
    {
      id: 'power_instant_formula',
      inputs: ['force', 'velocity'],
      fallbackInputs: ['force', 'speed'],
      operation: 'multiply',
      resultQuantityId: 'power',
      title: 'Anlık Güç Bağıntısı',
      katex: 'P = \\vec{F} \\cdot \\vec{v}',
      badge: 'Vektör · Vektör = Skaler',
      category: 'Enerji',
      description: 'Cisme uygulanan kuvvet ile anlık hızın skaler çarpımı anlık gücü verir.',
      wikiQuery: 'Güç (fizik)',
      intuition: 'Yüksek hızda rüzgar direncine karşı aynı kuvveti uygulamak araba motorundan çok daha yüksek güç talep eder.',
      dimensional: '[M][L][T]⁻² · [L][T]⁻¹ = [M][L]²[T]⁻³ (Watt)'
    },
    {
      id: 'pressure_formula',
      inputs: ['force', 'area'],
      operation: 'divide',
      resultQuantityId: 'pressure',
      title: 'Basınç İlkesi',
      katex: 'P = \\frac{F}{A}',
      badge: 'Vektör / Skaler = Skaler Alan',
      category: 'Akışkanlar',
      description: 'Birim yüzeye dik uygulanan kuvvet yoğunluğudur.',
      wikiQuery: 'Basınç',
      intuition: 'Topuklu ayakkabının kara batıp kar ayakkabısının batmaması alanın (A) basıncı devasa değiştirmesidir.',
      dimensional: '[M][L][T]⁻² / [L]² = [M][L]⁻¹[T]⁻² (Pascal, Pa)'
    },
    {
      id: 'momentum_formula',
      inputs: ['mass', 'velocity'],
      fallbackInputs: ['mass', 'speed'],
      operation: 'multiply',
      resultQuantityId: 'momentum',
      title: 'Çizgisel Momentum',
      katex: '\\vec{p} = m \\cdot \\vec{v}',
      badge: 'Skaler × Vektör = Vektör',
      category: 'Dinamik',
      description: 'Hareket miktarıdır. Bir cismin hızını ve durdurulma direncini belirler.',
      wikiQuery: 'Momentum',
      intuition: 'Yavaş giden bir yük gemisiyle hızlı uçan bir merminin her ikisi de devasa momentuma sahiptir; durdurmak inanılmaz zordur.',
      dimensional: '[M] · [L][T]⁻¹ = [M][L][T]⁻¹ (kg·m/s)'
    },
    {
      id: 'impulse_formula',
      inputs: ['force', 'time'],
      operation: 'multiply',
      resultQuantityId: 'impulse',
      title: 'İtme (İmpuls) ve Momentum Değişimi',
      katex: '\\vec{I} = \\vec{F} \\cdot \\Delta t = \\Delta\\vec{p}',
      badge: 'Vektör × Skaler = Vektör',
      category: 'Dinamik',
      description: 'Kuvvetin etki süresiyle çarpımı momentumdaki net değişimi üretir.',
      wikiQuery: 'İtme',
      intuition: 'Araçlardaki hava yastıkları çarpışma süresini (t) uzatarak vücudunuza binen darbe kuvvetini (F) ölümcül seviyenin altına çeker.',
      dimensional: '[M][L][T]⁻² · [T] = [M][L][T]⁻¹ (N·s)'
    },
    {
      id: 'potential_energy_formula',
      inputs: ['weight', 'distance'],
      operation: 'multiply',
      resultQuantityId: 'potential_energy',
      title: 'Yerçekimsel Potansiyel Enerji',
      katex: 'E_p = G \\cdot h = m \\cdot g \\cdot h',
      badge: 'Vektör × Skaler = Skaler',
      category: 'Enerji',
      description: 'Yerçekimine karşı yüksekliğe taşınan cisimde depolanan enerjidir.',
      wikiQuery: 'Potansiyel enerji',
      intuition: 'Baraj göllerinde toplanan su bu potansiyel enerjiyi saklar; kapaklar açılınca elektrik enerjisine dönüşür.',
      dimensional: '[M][L]²[T]⁻² (Joule)'
    },
    {
      id: 'kinetic_energy_formula',
      inputs: ['momentum', 'velocity'],
      fallbackInputs: ['momentum', 'speed'],
      operation: 'multiply',
      resultQuantityId: 'kinetic_energy',
      title: 'Kinetik Enerji',
      katex: 'E_k = \\frac{1}{2} m v^2 = \\frac{p \\cdot v}{2}',
      badge: 'Vektör · Vektör = Skaler',
      category: 'Enerji',
      description: 'Hareket halindeki kütlenin hızından kaynaklanan iş yapabilme kabiliyetidir.',
      wikiQuery: 'Kinetik enerji',
      intuition: 'Hız iki katına çıktığında kinetik enerji dört katına fırlar! Bu yüzden 100 km/s hızdaki bir kaza 50 km/s hızdakinin iki katı değil dört katı tahribat yaratır.',
      dimensional: '[M][L]²[T]⁻² (Joule)'
    },
    {
      id: 'charge_formula',
      inputs: ['current', 'time'],
      operation: 'multiply',
      resultQuantityId: 'electric_charge',
      title: 'Elektrik Yükü Korunumu',
      katex: 'q = I \\cdot t',
      badge: 'Skaler × Skaler = Skaler',
      category: 'Elektromanyetizma',
      description: 'İletkenden geçen toplam yük, akım ile sürenin çarpımıdır.',
      wikiQuery: 'Elektrik yükü',
      intuition: 'Telefon bataryalarındaki "4000 mAh" ibaresi tam olarak akım × zaman bağıntısıdır (toplam elektrik yükü kapasitesi).',
      dimensional: '[I] · [T] = [I][T] (Coulomb, C)'
    },
    {
      id: 'voltage_work_formula',
      inputs: ['work_energy', 'electric_charge'],
      operation: 'divide',
      resultQuantityId: 'voltage',
      title: 'Elektriksel Potansiyel Fark (Gerilim)',
      katex: 'V = \\frac{W}{q}',
      badge: 'Skaler / Skaler = Skaler',
      category: 'Elektromanyetizma',
      description: 'Birim yük başına düşen elektriksel iş/enerjidir (Volt = Joule / Coulomb).',
      wikiQuery: 'Gerilim (elektrik)',
      intuition: '12 Volt bir akü, kutupları arasından geçen her 1 Coulomb yüke 12 Joule enerji pompalar.',
      dimensional: '[M][L]²[T]⁻³[I]⁻¹ (Volt, V)'
    },
    {
      id: 'ohms_law',
      inputs: ['voltage', 'current'],
      operation: 'divide',
      resultQuantityId: 'resistance',
      title: "Ohm Kanunu (Direnç)",
      katex: 'R = \\frac{V}{I} \\iff V = I \\cdot R',
      badge: 'Skaler / Skaler = Skaler',
      category: 'Elektromanyetizma',
      description: 'İletkenin potansiyel farkına karşı gösterdiği akım direnci sabitidir.',
      wikiQuery: 'Ohm kanunu',
      intuition: 'Gerilim su borusundaki basınç, akım akan su miktarı, direnç ise borunun darlığıdır.',
      dimensional: '[M][L]²[T]⁻³[I]⁻² (Ohm, Ω)'
    },
    {
      id: 'einstein_mass_energy',
      inputs: ['mass', 'speed_of_light'],
      operation: 'multiply',
      resultQuantityId: 'mass_energy',
      title: 'Einstein Kütle-Enerji Eşdeğerliği',
      katex: 'E = m \\cdot c^2',
      badge: 'Skaler × Sabit = Skaler',
      category: 'Modern Fizik',
      description: 'Kütle donmuş enerjidir; ışık hızının karesi ile enerjiye dönüşür.',
      wikiQuery: 'Kütle-enerji eşdeğerliği',
      intuition: 'Sadece 1 gramlık bir madde tamamen enerjiye dönüştürülse devasa bir şehri aylarca aydınlatabilir.',
      dimensional: '[M] · [L]²[T]⁻² = [M][L]²[T]⁻² (Joule)'
    },
    {
      id: 'torque_formula',
      inputs: ['force', 'distance'],
      fallbackInputs: ['force', 'displacement'],
      operation: 'multiply',
      resultQuantityId: 'torque',
      title: 'Tork (Kuvvet Momenti)',
      katex: '\\vec{\\tau} = \\vec{r} \\times \\vec{F}',
      badge: 'Vektör × Vektör = Vektör',
      category: 'Mekanik',
      description: 'Kuvvetin menteşeye dik mesafeyle oluşturduğu döndürme etkisidir.',
      wikiQuery: 'Tork',
      intuition: 'Kapı kollarının menteşenin tam karşı ucuna konulması mesafe (r) arttıkça aynı torku daha küçük kuvvetle elde etmek içindir.',
      dimensional: '[M][L]²[T]⁻² (N·m)'
    },
    {
      id: 'frequency_formula',
      inputs: ['time', 'time'],
      operation: 'divide',
      resultQuantityId: 'frequency',
      title: 'Periyot ve Frekans',
      katex: 'f = \\frac{1}{T}',
      badge: '1 / Skaler = Skaler',
      category: 'Dalgalar',
      description: 'Birim zamandaki salınım veya dalga adedidir.',
      wikiQuery: 'Frekans',
      intuition: 'Kalbiniz dakikada 60 kez atıyorsa frekansı 1 Hertz (saniyede 1 atım) demektir.',
      dimensional: '[T]⁻¹ (Hertz, Hz)'
    },
    {
      id: 'wave_speed_formula',
      inputs: ['frequency', 'wavelength'],
      operation: 'multiply',
      resultQuantityId: 'speed',
      title: 'Dalga Yayılma Hızı',
      katex: 'v = \\lambda \\cdot f',
      badge: 'Skaler × Skaler = Skaler',
      category: 'Dalgalar',
      description: 'Dalga boyu ile frekansın çarpımı dalganın yayılma hızını verir.',
      wikiQuery: 'Dalga boyu',
      intuition: 'Denizdeki dalgaların sıklığı ile tepe aralıkları çarpıldığında dalganın kıyıya ulaşma hızı bulunur.',
      dimensional: '[L] · [T]⁻¹ = [L][T]⁻¹ (m/s)'
    },
    {
      id: 'molar_mass_formula',
      inputs: ['mass', 'amount_of_substance'],
      operation: 'divide',
      resultQuantityId: 'molar_mass',
      title: 'Molar Kütle Bağıntısı',
      katex: 'M = \\frac{m}{n}',
      badge: 'Skaler / Skaler = Skaler',
      category: 'Termodinamik & Kimya',
      description: 'Kütlenin madde miktarına (mol) oranı bir mol taneciğin kütlesini verir.',
      wikiQuery: 'Molar kütle',
      intuition: 'Avogadro sayısı kadar (6.022×10²³) taneciğin toplam kütlesidir. Karbon-12 için 12 g/mol dür.',
      dimensional: '[M] / [N] = [M][N]⁻¹ (kg/mol)'
    },
    {
      id: 'illuminance_formula',
      inputs: ['luminous_intensity', 'area'],
      fallbackInputs: ['luminous_intensity', 'distance'],
      operation: 'divide',
      resultQuantityId: 'illuminance',
      title: 'Aydınlanma Şiddeti (Fotometri)',
      katex: 'E = \\frac{I_v}{A} = \\frac{I_v}{d^2}',
      badge: 'Skaler / Skaler = Skaler',
      category: 'Optik',
      description: 'Işık şiddetinin aydınlatılan alana veya mesafenin karesine oranı aydınlanma şiddetini verir.',
      wikiQuery: 'Aydınlanma şiddeti',
      intuition: 'Lambadan uzaklaştıkça okuduğun kitabın yüzeyindeki aydınlık mesafenin karesiyle hızla azalır.',
      dimensional: '[J] / [L]² = [J][L]⁻² (Lüks, lx)'
    },
    {
      id: 'ideal_gas_law',
      inputs: ['amount_of_substance', 'temperature'],
      operation: 'multiply',
      resultQuantityId: 'work_energy',
      title: 'İdeal Gaz Termal Durumu',
      katex: 'P \\cdot V = n \\cdot R \\cdot T',
      badge: 'Skaler × Skaler = Enerji Durumu',
      category: 'Termodinamik',
      description: 'Gazın basınç-hacim çarpımı madde miktarı (n) ve mutlak sıcaklık (T) ile orantılıdır.',
      wikiQuery: 'İdeal gaz yasası',
      intuition: 'Düdüklü tencerede gaz ısındıkça basıncın yükselmesi veya sıcak hava balonunun genleşmesi bu kanundur.',
      dimensional: '[N] · [Θ] ➔ [M][L]²[T]⁻² (Joule)'
    }
  ],

  /**
   * Helper: Match reaction between two entities (can be quantities or formulas!)
   */
  findReaction(entityA, entityB) {
    if (!entityA || !entityB) return null;

    // Resolve IDs: if it's a formula, its primary identity is its resultQuantityId
    const idA = entityA.resultQuantityId || entityA.id;
    const idB = entityB.resultQuantityId || entityB.id;

    for (const formula of this.formulas) {
      const inputs = formula.inputs;
      const matchPrimary = (inputs[0] === idA && inputs[1] === idB) || (inputs[0] === idB && inputs[1] === idA);
      
      let matchFallback = false;
      if (formula.fallbackInputs) {
        const fb = formula.fallbackInputs;
        matchFallback = (fb[0] === idA && fb[1] === idB) || (fb[0] === idB && fb[1] === idA);
      }

      if (matchPrimary || matchFallback) {
        return formula;
      }
    }
    return null;
  }
};

if (typeof window !== 'undefined') {
  window.PHYSICS_DATA = PHYSICS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PHYSICS_DATA;
}
