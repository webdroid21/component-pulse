import type { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

export type TrainingModuleStatus = 'active' | 'draft' | 'coming_soon';
export type TrainingModuleVisibility = 'public' | 'logged_in';

export type TrainingMaterial = {
    id: string;      // internal ID or simply the storage path
    name: string;    // Display name, e.g. "Chapter 1 Guide.pdf"
    url: string;     // Firebase storage download URL
    size: number;    // File size in bytes
    type?: string;   // Optional MIME type
};

export type TimelineItem = {
    id?: string;
    title: string;
    description: string;
    duration: string; // e.g. "1 hour", "15 mins"
};

export type TrainingModule = {
    id: string;
    title: string;
    description: string;
    topics: string[];
    content: string; // Rich text HTML content
    coverImage: string; // URL
    materials: TrainingMaterial[];
    price: number;
    discount: number;
    isFree: boolean;
    visibility: TrainingModuleVisibility;
    status: TrainingModuleStatus;
    duration: string;
    timeline: TimelineItem[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

// Form data omits ID and Timestamps, uses Date for form state if needed, but here simple types match what RHF uses
export type TrainingModuleFormData = Omit<TrainingModule, 'id' | 'createdAt' | 'updatedAt'>;
