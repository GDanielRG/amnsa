export interface SearchFilterOption {
    label: string;
    value: string;
    icon?: string;
}

export interface SearchFilter {
    key: string;
    label: string;
    options: SearchFilterOption[];
}
