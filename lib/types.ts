// Clarion Type Definitions

// Common types
export type ConditionRating = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
export type SimpleCondition = 'Good' | 'Fair' | 'Poor';
export type YesNo = boolean;

// Building Condition Types
export interface BuildingConditionInputs {
  // Structural Assessment
  overallStructuralCondition: ConditionRating;
  roofCondition: ConditionRating;
  facadeCondition: ConditionRating;
  foundationIssues: 'None' | 'Minor' | 'Moderate' | 'Severe';

  // Interior Assessment
  internalLayoutQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  floorToCeilingHeight: number;
  naturalLightAssessment: 'Excellent' | 'Good' | 'Limited' | 'Poor';
  currentFitOutCondition: 'Modern' | 'Dated' | 'Poor' | 'Shell';

  // Age & Maintenance
  lastMajorRefurbishment: number | null; // year or null for "Never"
  estimatedRemainingLifespan: number;
  deferredMaintenanceEstimate: number;
}

// Planning & Architecture Types
export type UseClass = 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B8' | 'C1' | 'C2' | 'C3' | 'D1' | 'D2' | 'Sui Generis' | 'E' | 'F1' | 'F2';
export type ListedStatus = 'Not Listed' | 'Grade I' | 'Grade II*' | 'Grade II';
export type PlanningFeasibility = 'Straightforward' | 'Achievable' | 'Complex' | 'Unlikely';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface PlanningInputs {
  // Current Status
  currentUseClass: UseClass;
  conservationArea: boolean;
  listedBuilding: ListedStatus;
  article4Direction: boolean;

  // Development Potential
  permittedDevelopmentRights: boolean;
  extensionPotential: 'None' | 'Limited' | 'Moderate' | 'Significant';
  changeOfUseFeasibility: PlanningFeasibility;
  additionalFloorsPotential: number;

  // Planning History
  recentPlanningApplications: 'None' | 'Approved' | 'Refused' | 'Pending';
  planningRiskLevel: RiskLevel;
  estimatedPlanningTimeline: number; // months
}

// MEP & Services Types
export type CapacityLevel = 'Adequate' | 'Upgrade Needed' | 'Major Upgrade';
export type HVACType = 'Central' | 'Split' | 'VRF' | 'None';
export type HVACCondition = 'Good' | 'Fair' | 'Poor' | 'End of Life';
export type HeatingSource = 'Gas' | 'Electric' | 'Heat Pump' | 'District' | 'Other';
export type CoolingProvision = 'Full' | 'Partial' | 'None';
export type FireAlarmStatus = 'Modern' | 'Compliant' | 'Needs Upgrade' | 'Non-Compliant';
export type SprinklerStatus = 'Full' | 'Partial' | 'None';
export type CompartmentalisationStatus = 'Compliant' | 'Issues Identified' | 'Non-Compliant';

export interface MEPInputs {
  // Electrical
  electricalSystemAge: number;
  electricalCapacity: CapacityLevel;
  distributionBoardCondition: 'Good' | 'Fair' | 'Poor' | 'Replace';

  // Mechanical
  hvacSystemType: HVACType;
  hvacCondition: HVACCondition;
  heatingSource: HeatingSource;
  coolingProvision: CoolingProvision;

  // Plumbing
  plumbingCondition: SimpleCondition;
  waterPressure: 'Adequate' | 'Low' | 'Variable';

  // Lifts
  numberOfLifts: number;
  liftCondition: 'Good' | 'Fair' | 'Poor' | 'None';
  liftModernisationNeeded: boolean;

  // Fire & Life Safety
  fireAlarmSystem: FireAlarmStatus;
  sprinklerSystem: SprinklerStatus;
  compartmentalisationStatus: CompartmentalisationStatus;
}

// Costs Types
export interface CostsInputs {
  // Current Financials
  currentAnnualRent: number;
  currentOccupancyRate: number; // percentage
  currentAnnualServiceCharge: number;
  currentAnnualOperatingCosts: number;
  currentPropertyValueEstimate: number;

  // Refurbishment Costs
  lightRefurbishmentEstimate: number; // £/sqm
  fullRefurbishmentEstimate: number; // £/sqm
  extensionConversionCostEstimate: number; // £/sqm

  // Market Context
  comparableRentCurrentUse: number; // £/sqm/year
  comparableRentAlternativeUse: number; // £/sqm/year
  targetYield: number; // percentage
  estimatedSaleValuePostWorks: number;
}

// ESG & Compliance Types
export type EPCRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type TargetEPCRating = 'A' | 'B' | 'C';
export type RenewableEnergy = 'None' | 'Solar PV' | 'Other' | 'Multiple';
export type Certification = 'None' | 'BREEAM' | 'LEED' | 'Other';
export type TargetCertification = 'None' | 'BREEAM Excellent' | 'BREEAM Outstanding' | 'Net Zero';
export type AccessibilityRating = 'Full DDA Compliant' | 'Partial' | 'Non-Compliant';
export type WellbeingFeature = 'Cycling Facilities' | 'Showers' | 'Green Space' | 'Air Quality Monitoring' | 'Natural Light Optimisation';

export interface ESGInputs {
  // Energy Performance
  currentEPCRating: EPCRating;
  targetEPCRating: TargetEPCRating;
  energyUseIntensity: number; // kWh/sqm/year

  // Carbon & Environment
  carbonEmissionsCurrent: number; // kgCO2/sqm/year
  renewableEnergyOnSite: RenewableEnergy;
  greenBuildingCertification: Certification;
  targetCertification: TargetCertification;

  // Regulatory Compliance
  meesCompliant: boolean;
  meesDeadlineRisk: RiskLevel;
  epbdGegImplications: 'None' | 'Minor' | 'Significant' | 'Major';

  // Social & Governance
  occupierWellbeingFeatures: WellbeingFeature[];
  accessibilityRating: AccessibilityRating;
}

// Project Types
export type PropertyType = 'Office' | 'Residential' | 'Retail' | 'Industrial' | 'Mixed-Use' | 'Other';
export type ProjectStatus = 'In Progress' | 'Complete';

export interface ProjectInputs {
  condition?: BuildingConditionInputs;
  planning?: PlanningInputs;
  mep?: MEPInputs;
  costs?: CostsInputs;
  esg?: ESGInputs;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  city: string;
  propertyType: PropertyType;
  size: number; // sqm
  yearBuilt: number;
  clientName?: string;
  clientCompany?: string;
  inputs: ProjectInputs;
  results?: ScenarioResults;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

// Scenario & Results Types
export type RecommendationType = 'Proceed' | 'Optimise' | 'Exit';
export type ESGGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type ComplexityRating = 'Low' | 'Medium' | 'High';

export interface Scenario {
  id: 'A' | 'B' | 'C';
  name: string;
  description: string;
  capitalRequired: number;
  projectedAnnualIncome: number;
  netYield: number;
  irr: number;
  esgScore: ESGGrade;
  riskRating: RiskLevel;
  complexityRating: ComplexityRating;
  timeline: number; // months
  paybackPeriod: number; // years
  epcRatingAchieved: EPCRating;
  meesCompliant: boolean;
  planningComplexity: ComplexityRating;
  deliveryRisk: RiskLevel;
}

export interface CashFlowData {
  year: number;
  scenarioA: number;
  scenarioB: number;
  scenarioC: number;
}

export interface RiskReturnData {
  scenario: string;
  risk: number;
  irr: number;
}

export interface RiskFlag {
  severity: 'high' | 'medium' | 'low';
  message: string;
}

export interface ScenarioResults {
  recommendation: RecommendationType;
  recommendationSummary: string;
  recommendedScenario: 'A' | 'B' | 'C';
  scenarios: {
    A: Scenario;
    B: Scenario;
    C: Scenario;
  };
  cashFlowData: CashFlowData[];
  riskReturnData: RiskReturnData[];
  riskFlags: RiskFlag[];
  generatedAt: string;
}

// Form Section Types
export type FormSection = 'condition' | 'planning' | 'mep' | 'costs' | 'esg';

export interface FormSectionInfo {
  id: FormSection;
  name: string;
  icon: string;
  completed: boolean;
}

// Auth Types (mock)
export interface User {
  id: string;
  email: string;
  name: string;
}

// Store Types
export interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'inputs' | 'results'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  updateProjectInputs: (projectId: string, section: FormSection, data: unknown) => void;
  generateResults: (projectId: string) => ScenarioResults;
}
