
/**
 * @fileOverview Enhanced mock data generator for EpiGuard AI.
 * Provides realistic epidemiological curves inspired by global datasets (e.g., Kaggle COVID-19 JHU).
 */

export const REGIONS = [
  { id: 'world', name: 'Global', density: 50 },
  { id: 'us', name: 'United States', density: 36 },
  { id: 'uk', name: 'United Kingdom', density: 275 },
  { id: 'br', name: 'Brazil', density: 25 },
  { id: 'in', name: 'India', density: 464 },
  { id: 'fr', name: 'France', density: 119 },
  { id: 'de', name: 'Germany', density: 240 },
  { id: 'it', name: 'Italy', density: 200 },
];

export const DISEASES = [
  { id: 'covid19', name: 'COVID-19', betaBase: 0.18, gamma: 0.08, cfr: 0.012 },
  { id: 'flu', name: 'Influenza', betaBase: 0.12, gamma: 0.15, cfr: 0.001 },
  { id: 'dengue', name: 'Dengue Fever', betaBase: 0.22, gamma: 0.07, cfr: 0.008 },
  { id: 'measles', name: 'Measles', betaBase: 0.45, gamma: 0.05, cfr: 0.002 },
];

export interface DataPoint {
  date: string;
  cases: number;
  predictedCases?: number;
  deaths: number;
  recovered: number;
  vaccinationRate: number;
  mobilityIndex: number;
  rtValue: number;
  riskScore: number;
}

/**
 * Generates a realistic epidemiological wave using a modified SIR-like function.
 * Inspired by historical Kaggle datasets for COVID-19.
 */
export const generateMockHistory = (regionId: string, diseaseId: string = 'covid19', days: number = 60): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  const region = REGIONS.find(r => r.id === regionId) || REGIONS[0];
  const disease = DISEASES.find(d => d.id === diseaseId) || DISEASES[0];
  
  let seed = regionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + diseaseId.length;
  const seededRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Initial conditions based on region and disease profile
  let I = 10000 + (seededRandom() * 50000); 
  let R = I * 1.5;
  let V = 45 + (seededRandom() * 20); // Base vaccination rate
  let M = 85 + (seededRandom() * 15); // Base mobility
  
  const gamma = disease.gamma;
  const densityFactor = region.density / 200;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Wave logic: Add periodic oscillation to mimic outbreaks (Kaggle-style trend)
    const waveFactor = 1 + Math.sin(i / 12) * 0.5;
    const beta = disease.betaBase * (M / 100) * (1 - (V / 100) * 0.8) * (1 + densityFactor) * waveFactor;
    const rt = beta / gamma;
    
    const newInfections = I * beta * (seededRandom() * 0.1 + 0.95);
    const newRecoveries = I * gamma;
    
    I = Math.max(500, I + newInfections - newRecoveries);
    R += newRecoveries;
    V = Math.min(95, V + seededRandom() * 0.05); 
    M = Math.max(40, Math.min(130, M + (seededRandom() * 2 - 1)));

    const riskScore = Math.min(100, (rt * 35) + (I / 100000) * 30 + (densityFactor * 35));

    data.push({
      date: date.toISOString().split('T')[0],
      cases: Math.floor(I),
      deaths: Math.floor(I * disease.cfr),
      recovered: Math.floor(R),
      vaccinationRate: V,
      mobilityIndex: M,
      rtValue: rt,
      riskScore: riskScore
    });
  }
  return data;
};

export const generateMockPredictions = (
  history: DataPoint[], 
  diseaseId: string = 'covid19',
  days: number = 30,
  mobilityPolicy: number = 100
): DataPoint[] => {
  const predictions: DataPoint[] = [];
  if (history.length === 0) return [];
  
  const lastPoint = history[history.length - 1];
  const lastDate = new Date(lastPoint.date);
  const disease = DISEASES.find(d => d.id === diseaseId) || DISEASES[0];
  
  let I = lastPoint.cases;
  let V = lastPoint.vaccinationRate;
  const gamma = disease.gamma;
  const region = REGIONS[0]; 
  const densityFactor = region.density / 200;

  let seed = lastPoint.cases;
  const seededRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 1; i <= days; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);
    
    const beta = disease.betaBase * (mobilityPolicy / 100) * (1 - (V / 100) * 0.8) * (1 + densityFactor);
    const rt = beta / gamma;
    
    const newInfections = I * beta * (seededRandom() * 0.05 + 0.98);
    const newRecoveries = I * gamma;
    
    I = Math.max(0, I + newInfections - newRecoveries);
    V = Math.min(100, V + 0.02);

    predictions.push({
      date: date.toISOString().split('T')[0],
      cases: 0,
      predictedCases: Math.floor(I),
      deaths: Math.floor(I * disease.cfr),
      recovered: 0,
      vaccinationRate: V,
      mobilityIndex: mobilityPolicy,
      rtValue: rt,
      riskScore: Math.min(100, (rt * 40) + (I / 100000) * 20)
    });
  }
  return predictions;
};
