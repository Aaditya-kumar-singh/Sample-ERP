export const haversineMeters = (from, to) => {
    const R = 6371e3;
    const phi1 = (from.lat * Math.PI) / 180;
    const phi2 = (to.lat * Math.PI) / 180;
    const dPhi = ((to.lat - from.lat) * Math.PI) / 180;
    const dLambda = ((to.lng - from.lng) * Math.PI) / 180;

    const a =
        Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
        Math.cos(phi1) *
            Math.cos(phi2) *
            Math.sin(dLambda / 2) *
            Math.sin(dLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const isSameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};
