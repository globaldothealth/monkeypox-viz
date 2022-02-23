export interface FreshnessData {
    [index: string]: {
        last_upload: string | null;
        name: string;
        url: string;
    }[];
}

export interface ParsedFreshnessData {
    [index: string]: string | undefined;
}
