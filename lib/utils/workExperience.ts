import { TimelineItemData } from '@/data/workContent';

export interface CompanyGroup {
    companyName: string;
    logo: string;
    roles: TimelineItemData[];
}

/**
 * Groups consecutive timeline items by company name.
 * Items from the same company appearing consecutively are grouped together.
 */
export const groupItemsByCompany = (items: TimelineItemData[]): CompanyGroup[] => {
    const groups: CompanyGroup[] = [];

    items.forEach(item => {
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.companyName === item.company) {
            lastGroup.roles.push(item);
        } else {
            groups.push({
                companyName: item.company,
                logo: item.imageSrc,
                roles: [item]
            });
        }
    });

    return groups;
};
