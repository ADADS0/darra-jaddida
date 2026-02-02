// Central mapping of stock symbols to their logo files in Supabase storage
// Bucket: logostockburse

export const STORAGE_BASE_URL = "https://bphdlzclnianapnknwji.supabase.co/storage/v1/object/public/logostockburse";

// Complete stock logo mapping based on files in storage bucket
export const stockLogoMap: Record<string, string> = {
  // Banks
  "ATW": "attijariwafa-bank--big.svg",
  "BCP": "bcp--big.svg",
  "BOA": "bank-of-africa--big.svg",
  "CIH": "cih--big.svg",
  "CDM": "cdm--big.svg",
  "CFG": "cfg-bank--big.svg",
  "BNP": "paribas--big.svg",
  
  // Telecom
  "IAM": "itissalat-al-ma-inh-dh--big.svg",
  
  // Distribution
  "LBV": "label-vie--big.svg",
  "ATH": "auto-hall--big.svg",
  "SNA": "stokvis-nord-afrique--big.svg",
  "CTM": "ctm--big.svg",
  
  // Mining
  "MNG": "miniere-touissit--big.svg",
  "SMI": "smi--big.svg",
  "CMT": "ciments-du-maroc--big.svg",
  "LHM": "lafargeholcim-bangladesh--big.svg",
  "ZDJ": "zellidja-sa--big.svg",
  
  // Energy
  "TQM": "taqa-morocco--big.svg",
  "TMA": "total--big.svg",
  "GAZ": "afriquia-gaz--big.svg",
  
  // Real Estate
  "ADH": "douja-prom-addoha--big.svg",
  "ALM": "alliances--big.svg",
  "RDS": "res-dar-saada--big.svg",
  "AKD": "akdital-sa--big.svg",
  "ARD": "aradei-capital--big.svg",
  "RSM": "risma--big.svg",
  "IMR": "immorente-invest--big.svg",
  "BLM": "balima--big.svg",
  
  // Insurance
  "WAA": "wafa-assurance--big.svg",
  "SAH": "sanlam-limited--big.svg",
  "ATL": "atlantasanad--big.svg",
  "AGMA": "agma--big.svg",
  
  // Technology
  "HPS": "hps--big.svg",
  "DIS": "disway--big.svg",
  "MIC": "microdata--big.svg",
  "M2M": "m2m--big.svg",
  "IBS": "ib-maroccom--big.svg",
  "INV": "involys--big.svg",
  "DTY": "disty-technologies--big.svg",
  
  // Food Industry
  "CSR": "cosumar--big.svg",
  "SBM": "societe-des-boissons-du-maroc--big.svg",
  "LES": "lesieur-cristal--big.svg",
  "OUL": "oulmes--big.svg",
  "UMR": "unimer--big.svg",
  "DRC": "dari-couspate--big.svg",
  "MUT": "mutandis-sca--big.svg",
  
  // Steel & Industry
  "SNS": "sonasid--big.svg",
  "SNP": "snep--big.svg",
  "ALU": "aluminium-du-maroc--big.svg",
  "FBR": "fenie-brossette--big.svg",
  "STR": "stroc-industrie--big.svg",
  "REM": "realisations-mecaniques--big.svg",
  "CLR": "colorado--big.svg",
  "DEL": "delta--big.svg",
  "AIC": "afric-industries--big.svg",
  "MOP": "maghreb-oxygene--big.svg",
  "MDP": "med-paper--big.svg",
  
  // Construction
  "TGCC": "travaux-generaux-de-constructions-de-casablanca--big.svg",
  "JET": "jet-contractors--big.svg",
  
  // Logistics
  "MSA": "sodep-marsa-maroc--big.svg",
  
  // Finance & Leasing
  "EQD": "eqdom--big.svg",
  "SLF": "salafin--big.svg",
  "MAL": "maghrebail--big.svg",
  "MLE": "maroc-leasing--big.svg",
  "SMM": "sm-monetique--big.svg",
  
  // Services
  "AFM": "afma--big.svg",
  "CMGP": "cmgp--big.svg",
  "RBC": "rebab-company--big.svg",
  "VCN": "vicenne--big.svg",
  
  // Pharma
  "SOT": "sothema--big.svg",
  "PRM": "promopharm-sa--big.svg",
};

/**
 * Get the full URL for a stock's logo from Supabase storage
 * @param symbol - The stock symbol (e.g., "ATW", "IAM")
 * @returns The full URL to the logo, or empty string if not found
 */
export const getStockLogoUrl = (symbol: string): string => {
  const logoFile = stockLogoMap[symbol?.toUpperCase()];
  if (logoFile) {
    return `${STORAGE_BASE_URL}/${logoFile}`;
  }
  return "";
};

/**
 * Check if a stock has a logo available
 * @param symbol - The stock symbol
 * @returns true if logo exists in mapping
 */
export const hasStockLogo = (symbol: string): boolean => {
  return !!stockLogoMap[symbol?.toUpperCase()];
};
