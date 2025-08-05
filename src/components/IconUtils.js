import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';
import * as TbIcons from 'react-icons/tb';
import * as AiIcons from 'react-icons/ai';

// Map of all icon sets
export const ICON_SETS = {
    Fa: FaIcons,
    Md: MdIcons,
    Gi: GiIcons,
    Tb: TbIcons,
    Ai: AiIcons,
};

// Get all icon names (for search)
export const ALL_ICON_NAMES = [
    ...Object.keys(FaIcons),
    ...Object.keys(MdIcons),
    ...Object.keys(GiIcons),
    ...Object.keys(TbIcons),
    ...Object.keys(AiIcons),
];

// Dynamically resolve icon component by name
export function getIconComponent(name) {
    if (!name) return null;
    const prefix = name.slice(0, 2);
    const set = ICON_SETS[prefix];
    return set ? set[name] : null;
}
