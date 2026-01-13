import type { FlattenedListing } from "../types";

function groupByKeyValue<K extends keyof FlattenedListing>(
    data: FlattenedListing[],
    key: K,
    value: string
): FlattenedListing[] {
    return data.filter((item) => {
        const keyValue = item[key];
        return typeof keyValue === 'string' && keyValue === value;
    });
}

export default groupByKeyValue