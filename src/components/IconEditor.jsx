import AsyncIconSelect from './AsyncIconSelect';

export default function IconEditor({ icon, index, onChange, onRemove, canRemove }) {
    return (
        <div className="bg-neutral-700 rounded-lg p-3 flex flex-col gap-2 border border-neutral-600">
            <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-sm">Icon {index + 1}</span>
                {canRemove && (
                    <button
                        className="btn btn-xs btn-circle btn-ghost text-error ml-auto"
                        title="Remove Icon"
                        onClick={onRemove}
                    >
                        ✕
                    </button>
                )}
            </div>
            <AsyncIconSelect
                value={icon.name}
                onChange={name => onChange({ ...icon, name })}
                className="bg-neutral-800 text-neutral-100 border-neutral-600"
                dropdownClassName="bg-neutral-900 text-neutral-100 border-neutral-700"
            />
            <div className="flex flex-col gap-2 mt-2">
                <div className="flex flex-col mb-4">
                    <label className="text-xs font-medium text-neutral-400 mb-2">Icon Color</label>
                    <input
                        type="color"
                        value={icon.color}
                        onChange={e => onChange({ ...icon, color: e.target.value })}
                        className="input input-xs h-12 w-24 border-none bg-transparent rounded-lg shadow"
                        style={{ maxWidth: '100px', padding: '6px', marginBottom: '4px' }}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col">
                        <label className="text-xs font-medium text-neutral-400">Size</label>
                        <input
                            type="range"
                            min="20"
                            max="120"
                            value={icon.size}
                            onChange={e => onChange({ ...icon, size: Number(e.target.value) })}
                            className="range range-primary"
                        />
                        <input
                            type="number"
                            min="20"
                            max="120"
                            value={icon.size}
                            onChange={e => onChange({ ...icon, size: Number(e.target.value) })}
                            className="input input-xs input-bordered mt-1 bg-neutral-800 text-neutral-100 border-neutral-600"
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="text-xs font-medium text-neutral-400">X</label>
                        <input
                            type="range"
                            min="-150"
                            max="150"
                            value={icon.x}
                            onChange={e => onChange({ ...icon, x: Number(e.target.value) })}
                            className="range range-secondary"
                        />
                        <input
                            type="number"
                            min="-150"
                            max="150"
                            value={icon.x}
                            onChange={e => onChange({ ...icon, x: Number(e.target.value) })}
                            className="input input-xs input-bordered mt-1 bg-neutral-800 text-neutral-100 border-neutral-600"
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="text-xs font-medium text-neutral-400">Y</label>
                        <input
                            type="range"
                            min="-150"
                            max="150"
                            value={icon.y}
                            onChange={e => onChange({ ...icon, y: Number(e.target.value) })}
                            className="range range-accent"
                        />
                        <input
                            type="number"
                            min="-150"
                            max="150"
                            value={icon.y}
                            onChange={e => onChange({ ...icon, y: Number(e.target.value) })}
                            className="input input-xs input-bordered mt-1 bg-neutral-800 text-neutral-100 border-neutral-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
