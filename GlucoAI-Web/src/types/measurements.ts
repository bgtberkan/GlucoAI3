export interface GlucoseMeasurement {
  id: string;
  userId: string;
  level: number; // mg/dL
  timestamp: Date;
  notes?: string;
}

export interface InsulinDose {
  id: string;
  userId: string;
  amount: number; // units
  timestamp: Date;
  insulinType?: string; // e.g., "Rapid-acting", "Long-acting"
  notes?: string;
} 