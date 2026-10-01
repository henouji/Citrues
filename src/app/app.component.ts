import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';

interface OrangeVariety {
  id: string;
  name: string;
  scientificName: string;
  category: 'sweet' | 'juicing' | 'specialty';
  origin: string;
  season: string;
  sweetness: number; // 1-5
  acidity: number;   // 1-5
  juiciness: number; // 1-5
  colorCode: string;
  secondaryColor: string;
  description: string;
  keyFeatures: string[];
  vitaminC: number; // mg per 100g
  characterName: string;
  backstory: string;
}

interface VectorAsset {
  id: string;
  name: string;
  characterName: string;
  backstory: string;
  description: string;
  format: string;
  dimensions: string;
  palette: string[];
  vitaminCLevel: number; // 0-100%
  peeled: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Citrues';
  activeTab: string = 'hero';
  selectedCategory: string = 'all';
  selectedVarietyModal: OrangeVariety | null = null;
  Math = Math;

  // Sound & Theme state
  isMuted: boolean = true;
  isDarkMode: boolean = false;
  ripeness: number = 100; // 0 (green) to 100 (ripe orange)
  seedsFoundCount: number = 0;
  totalSeedsCount: number = 5;
  foundSeedsMap: { [key: number]: boolean } = {};

  // Customizer state
  customColor: string = '#FF8C00';
  customPithColor: string = '#FFF9E6';
  customSegmentsCount: number = 10;
  showLeaf: boolean = true;
  showSeeds: boolean = true;
  isRotating: boolean = false;
  scaleFactor: number = 1;

  // Easter Egg states
  logoClickCount: number = 0;
  isRainingOranges: boolean = false;
  isJuiceFilling: boolean = false;
  isLemonized: boolean = false; // Konami code effect
  typedBuffer: string = '';
  konamiSequence: string[] = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  konamiIndex: number = 0;

  // Fact or Fake Modal state
  showFactModal: boolean = false;
  currentFact: { text: string; isReal: boolean; explanation: string } | null = null;
  factUserAnswered: boolean = false;
  factUserResult: boolean = false;

  // Juice-o-meter progress
  scrollProgress: number = 0;

  // Tab title original
  originalTitle: string = 'Citrues | The Ultimate Orange Vector Showcase';

  // Sound synthesizer
  private audioCtx: AudioContext | null = null;

  vectorAssets: VectorAsset[] = [
    {
      id: 'whole-sphere',
      name: 'Whole Sphere Orange',
      characterName: 'Gerald',
      backstory: 'A navel orange with mild trust issues and a spherical ambition.',
      description: 'Full-bodied orange with natural light curvature, glossy highlight arc, and stem leaf.',
      format: 'Scalable Vector (SVG)',
      dimensions: '200 × 200 px',
      palette: ['#FFCA28', '#FF8F00', '#E65100', '#2E7D32'],
      vitaminCLevel: 95,
      peeled: false
    },
    {
      id: 'cross-section',
      name: 'Cross Section Slice',
      characterName: 'Slicey McSqueeze',
      backstory: 'Loves showing off his 8 symmetrical pulp wedges at parties.',
      description: '8-wedge pulp structure complete with central white core, pith boundaries, and translucent sheen.',
      format: 'Scalable Vector (SVG)',
      dimensions: '200 × 200 px',
      palette: ['#FF6D00', '#FFF8E1', '#FFA000', '#FFB300'],
      vitaminCLevel: 92,
      peeled: false
    },
    {
      id: 'blood-crimson',
      name: 'Blood Orange Crimson Slice',
      characterName: 'Symphony Moro',
      backstory: 'A dramatic Sicilian dark soul who writes gothic poetry in berry juice.',
      description: 'Rich anthocyanin ruby tones with dark maroon pulp gradient and contrasting ivory pith.',
      format: 'Scalable Vector (SVG)',
      dimensions: '200 × 200 px',
      palette: ['#B71C1C', '#D32F2F', '#FF5722', '#FFE0B2'],
      vitaminCLevel: 98,
      peeled: false
    },
    {
      id: 'juice-glass',
      name: 'Fresh Juice Glass',
      characterName: 'Tang-o-Matic',
      backstory: 'Dreaming of the big breakfast table in the sky.',
      description: 'Vector tumbler filled with freshly squeezed orange juice, floating ice cubes, and rim garnish.',
      format: 'Scalable Vector (SVG)',
      dimensions: '200 × 200 px',
      palette: ['#FFB74D', '#F57C00', '#E91E63', '#FFFFFF'],
      vitaminCLevel: 88,
      peeled: false
    },
    {
      id: 'blossom-branch',
      name: 'Orange Blossom & Branch',
      characterName: 'Flora Petal',
      backstory: 'Scented like a spring morning in Valencia, proud of her golden stamens.',
      description: 'Fragrant white citrus blossom with golden stamens, dark green leaves, and budding fruit.',
      format: 'Scalable Vector (SVG)',
      dimensions: '200 × 200 px',
      palette: ['#FFFFFF', '#FFD54F', '#2E7D32', '#4E342E'],
      vitaminCLevel: 75,
      peeled: false
    },
    {
      id: 'crescent-wedge',
      name: 'Crescent Orange Wedge',
      characterName: 'Wedge-Head',
      backstory: 'Always leaning at a 15-degree angle, ready for soccer halftime snacks.',
      description: 'Classic snack slice wedge illustrating curved outer rind contour and triple pulp compartment.',
      format: 'Scalable Vector (SVG)',
      dimensions: '200 × 200 px',
      palette: ['#E65100', '#FFF8E1', '#FFA000'],
      vitaminCLevel: 85,
      peeled: false
    }
  ];

  varieties: OrangeVariety[] = [
    {
      id: 'valencia',
      name: 'Valencia Orange',
      scientificName: 'Citrus sinensis "Valencia"',
      category: 'juicing',
      origin: 'California / Florida, USA',
      season: 'March to October',
      sweetness: 4,
      acidity: 3,
      juiciness: 5,
      colorCode: '#FF7B00',
      secondaryColor: '#FFA726',
      description: 'Prized worldwide as the ultimate juicing orange. Exceptionally juicy with a balanced sweet-tart taste that stays fresh.',
      keyFeatures: ['Thin smooth skin', 'High juice content', 'Rich in Vitamin C', 'Fewer seeds'],
      vitaminC: 53.2,
      characterName: 'Sir Squeeze-a-Lot',
      backstory: 'Refuses to be squeezed without an enthusiastic fanfare.'
    },
    {
      id: 'navel',
      name: 'Washington Navel',
      scientificName: 'Citrus sinensis "Navel"',
      category: 'sweet',
      origin: 'Bahia, Brazil',
      season: 'November to June',
      sweetness: 5,
      acidity: 2,
      juiciness: 4,
      colorCode: '#FF9800',
      secondaryColor: '#FFB74D',
      description: 'The classic eating orange. Known for its distinctive second mini-fruit "navel" at the apex, seedless flesh, and easy peeling.',
      keyFeatures: ['Seedless', 'Easy to peel', 'Naturally very sweet', 'Signature apex navel'],
      vitaminC: 59.1,
      characterName: 'Bellybutton Bob',
      backstory: 'Proud of his secret twin fruit inside.'
    },
    {
      id: 'blood-moro',
      name: 'Moro Blood Orange',
      scientificName: 'Citrus sinensis "Moro"',
      category: 'specialty',
      origin: 'Sicily, Italy',
      season: 'December to April',
      sweetness: 3,
      acidity: 4,
      juiciness: 4,
      colorCode: '#C62828',
      secondaryColor: '#FF5722',
      description: 'Distinctive deep crimson interior coloured by anthocyanin pigments. Has a complex, berry-like hint of raspberry.',
      keyFeatures: ['Ruby crimson flesh', 'Raspberry aroma', 'High anthocyanin antioxidants', 'Dramatic slice look'],
      vitaminC: 60.0,
      characterName: 'Count Citrusula',
      backstory: 'I vant to drink your Vitamin C!'
    },
    {
      id: 'cara-cara',
      name: 'Cara Cara Navel',
      scientificName: 'Citrus sinensis "Cara Cara"',
      category: 'sweet',
      origin: 'Hacienda Cara Cara, Venezuela',
      season: 'December to May',
      sweetness: 5,
      acidity: 1,
      juiciness: 4,
      colorCode: '#FF6B6B',
      secondaryColor: '#FFA07A',
      description: 'A unique pink-fleshed navel orange. Extraordinarily sweet with low acidity and subtle notes of rose and cherry.',
      keyFeatures: ['Rose-pink pulp', 'Ultra-low acidity', 'Cherry-berry nuances', 'Seedless'],
      vitaminC: 67.0,
      characterName: 'Pinky Promise',
      backstory: 'Swears she is 100% natural and not a grapefruit in disguise.'
    },
    {
      id: 'mandarin',
      name: 'Clementine Mandarin',
      scientificName: 'Citrus clementina',
      category: 'sweet',
      origin: 'Algeria',
      season: 'October to February',
      sweetness: 5,
      acidity: 2,
      juiciness: 4,
      colorCode: '#FFA000',
      secondaryColor: '#FFC107',
      description: 'Compact, fragrant, and child-friendly. Zipper-skin makes it effortless to peel into luscious sweet segments.',
      keyFeatures: ['Zipper peel', 'Portable size', 'Kid-favorite snack', 'Aromatic essential oils'],
      vitaminC: 48.8,
      characterName: 'Clemmy',
      backstory: 'Unzips her jacket at the first sign of sunshine.'
    },
    {
      id: 'seville',
      name: 'Seville Bitter Orange',
      scientificName: 'Citrus aurantium',
      category: 'specialty',
      origin: 'Southeast Asia / Spain',
      season: 'January to February',
      sweetness: 1,
      acidity: 5,
      juiciness: 3,
      colorCode: '#E65100',
      secondaryColor: '#EF6C00',
      description: 'A bitter citrus renowned for making world-class marmalade, orange liqueurs (Grand Marnier, Cointreau), and aromatic oils.',
      keyFeatures: ['High pectin', 'Aromatic peel', 'High acidity & bitterness', 'Marmalade standard'],
      vitaminC: 45.0,
      characterName: 'Bitter Betty',
      backstory: 'Makes the best marmalade, but won’t stop complaining about sugar prices.'
    }
  ];

  factsList = [
    {
      text: 'Oranges were named after their color.',
      isReal: false,
      explanation: 'Fake! The word for the color "orange" actually comes from the Sanskrit word "naranga" for the fruit itself!'
    },
    {
      text: 'Brazil is the largest orange producer in the world.',
      isReal: true,
      explanation: 'Real! Brazil produces around 30% of the entire world’s annual orange yield.'
    },
    {
      text: 'There are over 600 varieties of oranges worldwide.',
      isReal: true,
      explanation: 'Real! From sweet navels to bitter Sevilles and blood oranges, there are hundreds of cultivars.'
    },
    {
      text: 'Eating orange peels gives you glowing skin instantly.',
      isReal: false,
      explanation: 'Fake! Orange peels are edible and nutrient-dense, but they won’t make you glow instantly!'
    },
    {
      text: 'Christopher Columbus planted the first orange trees in the Caribbean in 1493.',
      isReal: true,
      explanation: 'Real! Columbus brought orange seeds to Hispaniola during his second voyage.'
    }
  ];

  ngOnInit() {
    this.originalTitle = document.title || 'Citrues | The Ultimate Orange Vector Showcase';
  }

  ngOnDestroy() {
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = height > 0 ? (winScroll / height) * 100 : 0;
  }

  @HostListener('window:blur')
  onWindowBlur() {
    document.title = "Come back, I'm getting pulpy… 🍊";
  }

  @HostListener('window:focus')
  onWindowFocus() {
    document.title = this.originalTitle;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check Konami Code
    if (event.key === this.konamiSequence[this.konamiIndex]) {
      this.konamiIndex++;
      if (this.konamiIndex === this.konamiSequence.length) {
        this.triggerKonamiCode();
        this.konamiIndex = 0;
      }
    } else {
      this.konamiIndex = 0;
    }

    // Check typing "juice"
    this.typedBuffer += event.key.toLowerCase();
    if (this.typedBuffer.length > 10) {
      this.typedBuffer = this.typedBuffer.slice(-10);
    }
    if (this.typedBuffer.includes('juice')) {
      this.triggerJuiceFill();
      this.typedBuffer = '';
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted && !this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  playSquishSound() {
    if (this.isMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.18);
    } catch (e) {
      // Audio fallback
    }
  }

  triggerSquirt(event: MouseEvent) {
    this.playSquishSound();
    const x = event.clientX;
    const y = event.clientY;
    this.createJuiceParticles(x, y);
  }

  createJuiceParticles(x: number, y: number) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < 12; i++) {
      const drop = document.createElement('div');
      drop.className = 'juice-drop-particle';
      drop.style.left = `${x}px`;
      drop.style.top = `${y}px`;
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      drop.style.setProperty('--dx', `${dx}px`);
      drop.style.setProperty('--dy', `${dy}px`);
      container.appendChild(drop);
    }

    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 800);
  }

  togglePeel(asset: VectorAsset) {
    asset.peeled = !asset.peeled;
    this.playSquishSound();
  }

  onLogoClick(event: MouseEvent) {
    this.logoClickCount++;
    this.triggerSquirt(event);
    if (this.logoClickCount >= 5) {
      this.triggerOrangeRain();
      this.logoClickCount = 0;
    }
  }

  triggerOrangeRain() {
    this.isRainingOranges = true;
    setTimeout(() => {
      this.isRainingOranges = false;
    }, 6000);
  }

  triggerJuiceFill() {
    this.isJuiceFilling = true;
    this.playSquishSound();
    setTimeout(() => {
      this.isJuiceFilling = false;
    }, 4000);
  }

  triggerKonamiCode() {
    this.isLemonized = !this.isLemonized;
    this.playSquishSound();
  }

  collectSeed(seedId: number) {
    if (!this.foundSeedsMap[seedId]) {
      this.foundSeedsMap[seedId] = true;
      this.seedsFoundCount++;
      this.playSquishSound();
    }
  }

  openFactModal() {
    const randomIndex = Math.floor(Math.random() * this.factsList.length);
    this.currentFact = this.factsList[randomIndex];
    this.factUserAnswered = false;
    this.showFactModal = true;
  }

  answerFact(userGuessedReal: boolean) {
    if (!this.currentFact) return;
    this.factUserAnswered = true;
    this.factUserResult = userGuessedReal === this.currentFact.isReal;
    this.playSquishSound();
  }

  closeFactModal() {
    this.showFactModal = false;
  }

  downloadSvg(asset: VectorAsset) {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#FF8C00"/><circle cx="100" cy="100" r="70" fill="#FFF9E6"/><circle cx="100" cy="100" r="64" fill="#FFA000"/></svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.id}-vector-citrues.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  get filteredVarieties(): OrangeVariety[] {
    if (this.selectedCategory === 'all') {
      return this.varieties;
    }
    return this.varieties.filter(v => v.category === this.selectedCategory);
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  openVarietyModal(variety: OrangeVariety) {
    this.selectedVarietyModal = variety;
  }

  closeModal() {
    this.selectedVarietyModal = null;
  }

  toggleRotation() {
    this.isRotating = !this.isRotating;
  }

  getMembraneX2(idx: number, total: number): number {
    const angle = (idx * (360 / total)) * (Math.PI / 180);
    return 100 + 78 * Math.cos(angle);
  }

  getMembraneY2(idx: number, total: number): number {
    const angle = (idx * (360 / total)) * (Math.PI / 180);
    return 100 + 78 * Math.sin(angle);
  }

  getSegmentPath(index: number, total: number, innerRadius: number = 22, outerRadius: number = 76): string {
    const anglePerSegment = 360 / total;
    const gap = 3;
    const startAngle = (index * anglePerSegment + gap / 2) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSegment - gap / 2) * (Math.PI / 180);

    const x1 = 100 + innerRadius * Math.cos(startAngle);
    const y1 = 100 + innerRadius * Math.sin(startAngle);
    const x2 = 100 + outerRadius * Math.cos(startAngle);
    const y2 = 100 + outerRadius * Math.sin(startAngle);
    const x3 = 100 + outerRadius * Math.cos(endAngle);
    const y3 = 100 + outerRadius * Math.sin(endAngle);
    const x4 = 100 + innerRadius * Math.cos(endAngle);
    const y4 = 100 + innerRadius * Math.sin(endAngle);

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  }

  get ArrayFromCount(): number[] {
    return Array.from({ length: this.customSegmentsCount }, (_, i) => i);
  }

  scrollToSection(sectionId: string) {
    this.activeTab = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
