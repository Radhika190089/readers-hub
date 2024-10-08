export const desktopOS = [
    {
        label: 'Transactions',
        value: 1,
    },

];

export const mobileOS = [
    {
        label: 'Borrow',
        value: 2,
    },
    {
        label: 'Readers',
        value: 2,
    },


];
export const platforms = [
    {
        label: 'Mobile',
        value: 59.12,
    },
    {
        label: 'Desktop',
        value: 40.88,
    },
];

const normalize = (v: number, v2: number) => Number.parseFloat(((v * v2) / 100).toFixed(2));

export const mobileAndDesktopOS = [
    ...mobileOS.map((v) => ({
        ...v,
        label: v.label === 'Other' ? 'Other (Mobile)' : v.label,
        value: normalize(v.value, platforms[0].value),
    })),
    ...desktopOS.map((v) => ({
        ...v,
        label: v.label === 'Other' ? 'Other (Desktop)' : v.label,
        value: normalize(v.value, platforms[1].value),
    })),
];

export const valueFormatter = (item: { value: number }) => `${item.value}%`;