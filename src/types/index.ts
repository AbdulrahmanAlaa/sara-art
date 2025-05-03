export interface MetaData {
    title: string;
    description: string;
}

export interface PortfolioItem {
    id: string;
    img: string;
    description: string;
    link: string;
}

export interface SocialProfiles {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    facebook?: string;
    github?: string;
    twitter?: string;
}

export interface ContactConfig {
    YOUR_EMAIL: string;
    description: string;
    YOUR_SERVICE_ID: string;
    YOUR_TEMPLATE_ID: string;
}
