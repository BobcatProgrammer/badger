import AsyncIconSelect from './AsyncIconSelect';
import { FaTrash } from 'react-icons/fa';
import "./IconEditor.css"; // Assuming you have some styles for this component

export default function IconEditor({ icon, index, onChange, onRemove, canRemove }) {
    // Set default min/max if not provided via props
    const sizeMin = typeof IconEditor.sizeMin === 'number' ? IconEditor.sizeMin : 20;
    const sizeMax = typeof IconEditor.sizeMax === 'number' ? IconEditor.sizeMax : 200;

    return (
        <div className="card bg-base-300 border border-base-300">
            <div className="card-body p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="badge badge-primary badge-sm">Icon {index + 1}</span>
                    {canRemove && (
                        <button
                            className="btn btn-error flex items-center"
                            title="Remove Icon"
                            onClick={onRemove}
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>

                <AsyncIconSelect
                    value={icon.name}
                    onChange={name => onChange({ ...icon, name })}
                    className="select select-bordered w-full"
                    dropdownClassName="bg-base-200 border-base-300"
                />

                <div className="space-y-3">
                    <label className="label">
                        <span className="label-text">Icon Color</span>
                    </label>
                    <input
                        type="color"
                        value={icon.color}
                        onChange={e => onChange({ ...icon, color: e.target.value })}
                        className="input input-sm w-20 h-10 p-1"
                    />

                    <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                            <label className="label">
                                <span className="label-text text-xs">Size</span>
                            </label>
                            <input
                                type="range"
                                min={sizeMin}
                                max={sizeMax}
                                value={icon.size}
                                onChange={e => onChange({ ...icon, size: Number(e.target.value) })}
                                className="range range-primary range-xs"
                            />
                            <input
                                type="number"
                                min={sizeMin}
                                max={sizeMax}
                                value={icon.size}
                                onChange={e => onChange({ ...icon, size: Number(e.target.value) })}
                                className="input input-xs text-center"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="label">
                                <span className="label-text text-xs">X</span>
                            </label>
                            <input
                                type="range"
                                min="-150"
                                max="150"
                                value={icon.x}
                                onChange={e => onChange({ ...icon, x: Number(e.target.value) })}
                                className="range range-secondary range-xs"
                            />
                            <input
                                type="number"
                                min="-150"
                                max="150"
                                value={icon.x}
                                onChange={e => onChange({ ...icon, x: Number(e.target.value) })}
                                className="input input-xs text-center"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="label">
                                <span className="label-text text-xs">Y</span>
                            </label>
                            <input
                                type="range"
                                min="-150"
                                max="150"
                                value={icon.y}
                                onChange={e => onChange({ ...icon, y: Number(e.target.value) })}
                                className="range range-accent range-xs"
                            />
                            <input
                                type="number"
                                min="-150"
                                max="150"
                                value={icon.y}
                                onChange={e => onChange({ ...icon, y: Number(e.target.value) })}
                                className="input input-xs text-center"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="label">
                                <span className="label-text text-xs">Rotation</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="359"
                                value={icon.rotation || 0}
                                onChange={e => onChange({ ...icon, rotation: Number(e.target.value) })}
                                className="range range-info range-xs"
                            />
                            <input
                                type="number"
                                min="0"
                                max="359"
                                value={icon.rotation || 0}
                                onChange={e => onChange({ ...icon, rotation: Number(e.target.value) })}
                                className="input input-xs text-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
