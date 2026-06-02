import { TimelineItemData } from '@/lib/types/workExperience';

export interface CompanyGroup {
    companyName: string;
    logo: string;
    roles: TimelineItemData[];
}

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
