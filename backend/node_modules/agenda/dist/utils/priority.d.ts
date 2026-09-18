export type JobPriority = number | keyof typeof priorityMap;
declare const priorityMap: {
    lowest: number;
    low: number;
    normal: number;
    high: number;
    highest: number;
};
/**
 * Internal method to turn priority into a number
 */
export declare function parsePriority(priority?: JobPriority): number;
export {};
