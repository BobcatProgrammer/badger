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
                {Icon && <Icon size={24} color="#f3f4f6" />} {opt.label}
            </span>
        );
    };

    const currentOption = value ? { value, label: value } : null;

    // Custom dark mode styles for react-select
    const darkStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#23272e',
            borderColor: state.isFocused ? '#60a5fa' : '#374151',
            color: '#f3f4f6',
            boxShadow: state.isFocused ? '0 0 0 2px #60a5fa55' : base.boxShadow,
            '&:hover': { borderColor: '#60a5fa' },
        }),
        menu: base => ({
            ...base,
            backgroundColor: '#23272e',
            color: '#f3f4f6',
            zIndex: 9999,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#2563eb'
                : state.isFocused
                    ? '#374151'
                    : 'transparent',
            color: state.isSelected ? '#fff' : '#f3f4f6',
            cursor: 'pointer',
        }),
        singleValue: base => ({
            ...base,
            color: '#f3f4f6',
        }),
        input: base => ({
            ...base,
            color: '#f3f4f6',
        }),
        placeholder: base => ({
            ...base,
            color: '#9ca3af',
        }),
        noOptionsMessage: base => ({
            ...base,
            color: '#9ca3af',
        }),
        dropdownIndicator: base => ({
            ...base,
            color: '#9ca3af',
        }),
        clearIndicator: base => ({
            ...base,
            color: '#9ca3af',
        }),
    };

    return (
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions={false}
            value={currentOption}
            onChange={opt => onChange(opt?.value)}
            formatOptionLabel={formatOptionLabel}
            isClearable
            styles={darkStyles}
            placeholder="Type to search icons..."
            noOptionsMessage={() => 'Type at least 2 letters'}
        />
    );
}

export default AsyncIconSelect;
