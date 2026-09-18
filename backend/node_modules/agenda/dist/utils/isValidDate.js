export function isValidDate(date) {
    // An invalid date object returns NaN for getTime()
    return date !== null && Number.isNaN(new Date(date).getTime()) === false;
}
//# sourceMappingURL=isValidDate.js.map