export type TrackType = 'resilience' | 'sustainability' | 'cooperation' | 'innovation';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ActionPlanItem {
  role: string;
  task: string;
  urgency: string;
  status: string;
}

export interface MultilingualAlert {
  language: string;
  text: string;
}

export interface ResourceAllocationItem {
  resource: string;
  quantity: string;
  status: string;
  location: string;
}

export interface CommunityImpactMetrics {
  vulnerableResidentsAssisted: number;
  co2OrWasteDivertedKg: number;
  volunteerHoursOrganized: number;
  estimatedCrisisMitigationHours: number;
}

export interface CommunityIncidentClassification {
  track: string;
  category: string;
  priorityScore: number;
  severityLevel: string;
  estimatedAffectedPeople: number;
}

export interface CommunityActionData {
  classification: CommunityIncidentClassification;
  actionPlan: ActionPlanItem[];
  broadcastAlerts: {
    primary: string;
    multilingual: MultilingualAlert[];
  };
  resourceAllocation: ResourceAllocationItem[];
  communityImpactMetrics: CommunityImpactMetrics;
}

export interface IncidentPreset {
  id: string;
  track: TrackType;
  title: string;
  location: string;
  urgency: UrgencyLevel;
  description: string;
  targetLanguages: string[];
  resourceConstraints: string;
  tagline: string;
}

export interface SlideData {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  keyPoints: string[];
  metrics?: { label: string; value: string }[];
  technicalCallout?: string;
  speakerNotes: string;
}
