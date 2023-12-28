
interface SnackbarState {
    show: boolean;
    color: string;
    text: string;
    timeout: number;
}

// Assuming you have a separate file for types, e.g., types.ts
export type { SnackbarState };