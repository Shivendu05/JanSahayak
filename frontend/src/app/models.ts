export interface Scheme {
  id?: number;
  name: string;
  fullName?: string;
  description: string;
  category: string;
  targetGroup: string;
  eligibility: string;
  benefits: string;
  requiredDocuments: string;
  applicationProcess: string;
  deadline?: string;
  officialWebsite: string;
  officialApplicationUrl?: string;
  purpose?: string;
  department?: string;
  level?: string;
  eligibilityExclusions?: string;
  tags?: string;
  source?: string;
  lastVerified?: string;
  videoTitle?: string;
  videoUrl?: string;
}

export interface Video {
  id?: number;
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
}

export interface ResourceItem {
  id?: number;
  name: string;
  description: string;
  category: string;
  officialUrl: string;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalSchemes: number;
  totalResources: number;
  totalVideos: number;
  totalUsers: number;
}
