const priorityMap = {
    lowest: -20,
    low: -10,
    normal: 0,
    high: 10,
    highest: 20
};
/**
 * Internal method to turn priority into a number
 */
export function parsePriority(priority) {
    if (typeof priority === 'number') {
        return priority;
    }
    if (typeof priority === 'string' && priorityMap[priority]) {
        return priorityMap[priority];
    }
    return priorityMap.normal;
}
//# sourceMappingURL=priority.js.map