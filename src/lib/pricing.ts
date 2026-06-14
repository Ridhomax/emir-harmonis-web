export type VehicleType = 
  | "Motor Kecil" 
  | "Motor Sedang" 
  | "Motor Besar" 
  | "Mobil Kecil" 
  | "Mobil Sedang" 
  | "Mobil Besar";

export type ServiceType = 
  | "Cuci Hidrolik" 
  | "Poles Body & Wax" 
  | "Auto Detailing" 
  | "Nano Coating"
  | "Interior"
  | "Jamur Kaca"
  | "Ruang Mesin";

export const PRICING_MAP: Record<VehicleType, Partial<Record<ServiceType, number>>> = {
  "Motor Kecil": {
    "Cuci Hidrolik": 25000,
    "Poles Body & Wax": 100000,
    "Auto Detailing": 150000,
    "Nano Coating": 350000,
  },
  "Motor Sedang": {
    "Cuci Hidrolik": 35000,
    "Poles Body & Wax": 150000,
    "Auto Detailing": 250000,
    "Nano Coating": 500000,
  },
  "Motor Besar": {
    "Cuci Hidrolik": 45000,
    "Poles Body & Wax": 200000,
    "Auto Detailing": 350000,
    "Nano Coating": 700000,
  },
  "Mobil Kecil": {
    "Cuci Hidrolik": 50000,
    "Poles Body & Wax": 350000,
    "Auto Detailing": 600000,
    "Nano Coating": 1000000,
    "Interior": 150000,
    "Jamur Kaca": 150000,
    "Ruang Mesin": 175000,
  },
  "Mobil Sedang": {
    "Cuci Hidrolik": 60000,
    "Poles Body & Wax": 450000,
    "Auto Detailing": 750000,
    "Nano Coating": 1250000,
    "Interior": 175000,
    "Jamur Kaca": 175000,
    "Ruang Mesin": 200000,
  },
  "Mobil Besar": {
    "Cuci Hidrolik": 70000,
    "Poles Body & Wax": 550000,
    "Auto Detailing": 900000,
    "Nano Coating": 1500000,
    "Interior": 200000,
    "Jamur Kaca": 200000,
    "Ruang Mesin": 225000,
  }
};

export function getPrice(vehicleType: VehicleType | string, serviceType: ServiceType | string): number {
  const vType = vehicleType as VehicleType;
  const sType = serviceType as ServiceType;
  
  if (PRICING_MAP[vType] && PRICING_MAP[vType][sType]) {
    return PRICING_MAP[vType][sType]!;
  }
  
  // Default fallback if not found
  return 50000;
}
