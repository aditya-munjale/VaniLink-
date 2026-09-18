import humanInterval from 'human-interval';
export function calculateProcessEvery(input = 5000) {
    if (typeof input === 'number')
        return input;
    return humanInterval(input) || 5000;
}
//# sourceMappingURL=processEvery.js.map