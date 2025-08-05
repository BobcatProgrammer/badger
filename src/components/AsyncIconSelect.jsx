import AsyncSelect from 'react-select/async';
import { getIconComponent, ALL_ICON_NAMES } from './IconUtils';

function AsyncIconSelect({ value, onChange }) {
    const loadOptions = (inputValue, callback) => {
        if (!inputValue || inputValue.length < 2) {
            callback([]);
            return;
        }
        const matches = ALL_ICON_NAMES.filter(name =>
            name.toLowerCase().includes(inputValue.toLowerCase())
        ).slice(0, 30);
        callback(matches.map(name => ({ value: name, label: name })));
    };

    const formatOptionLabel = opt => {
        const Icon = getIconComponent(opt.value);
        return (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {Icon && <Icon size={24} />} {opt.label}
            </span>
        );
    };

    const currentOption = value ? { value, label: value } : null;

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions={false}
            value={currentOption}
            onChange={opt => onChange(opt?.value)}
            formatOptionLabel={formatOptionLabel}
            isClearable
            styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
            placeholder="Type to search icons..."
            noOptionsMessage={() => 'Type at least 2 letters'}
        />
    );
}

export default AsyncIconSelect;
