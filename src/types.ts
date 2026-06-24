export interface UnitData {
  id: string; // 'UH1', 'UH2', 'UH4', 'UH5'
  name: string;
  ingressats: number;
  quedenAvui: number;
  altes: number;
  pases: number;
  recMitja: number;
  recElevat: number;
  barthelMitja: number;
  traqueo: number;
  vm: number;
  pulseraErrant: number;
}

export type UnitId = 'UH1' | 'UH2' | 'UH4' | 'UH5';
