import { Component } from '@angular/core';

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
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'Citrues';
  activeTab: string = 'hero';
  selectedCategory: string = 'all';
  selectedVarietyModal: OrangeVariety | null = null;
  Math = Math;

  // Customizer state
  customColor: string = '#FF8C00';
  customPithColor: string = '#FFF9E6';
  customSegmentsCount: number = 10;
  showLeaf: boolean = true;
  showSeeds: boolean = true;
  rotationSpeed: number = 0;
  isRotating: boolean = false;
  scaleFactor: number = 1;

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
      vitaminC: 53.2
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
      vitaminC: 59.1
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
      vitaminC: 60.0
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
      vitaminC: 67.0
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
      vitaminC: 48.8
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
      vitaminC: 45.0
    }
  ];

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

  getSegmentAngle(index: number, total: number): number {
    return (360 / total) * index;
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
    const gap = 3; // degrees gap between segments
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
