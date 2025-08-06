
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AsyncIconSelect from './AsyncIconSelect';
import IconEditor from './IconEditor';
import { getIconComponent } from './IconUtils';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus } from 'react-icons/fa';

export default function BadgeEditor() {
    // --- State serialization helpers ---

    // Short field names for compact URL storage
    // t: topText, b: bottomText, i: icons, m: bgMode, c: bgColor, g1: gradientColor1, g2: gradientColor2, d: gradientDir, r: brimColor, x: textColor
    const serializeState = useCallback((state) => {
        const iconsNoId = state.icons.map(icon => {
            const iconCopy = { ...icon };
            delete iconCopy.id;
            return iconCopy;
        });
        const toSave = {
            t: state.topText,
            b: state.bottomText,
            i: iconsNoId,
            m: state.bgMode,
            c: state.bgColor,
            g1: state.gradientColor1,
            g2: state.gradientColor2,
            d: state.gradientDir,
            r: state.brimColor,
            x: state.textColor,
        };
        try {
            return btoa(JSON.stringify(toSave));
        } catch {
            return '';
        }
    }, []);

    // Support both old (long field names, URI encoded) and new (short, base64 only) formats
    const deserializeState = useCallback((str) => {
        try {
            let obj;
            try {
                // Try new format first
                obj = JSON.parse(atob(str));
            } catch {
                // Fallback: old format
                obj = JSON.parse(decodeURIComponent(atob(str)));
            }
            // Detect format by keys
            if (obj.t !== undefined && obj.b !== undefined && obj.i !== undefined) {
                // New format (short keys)
                return {
                    topText: obj.t || 'TOP',
                    bottomText: obj.b || 'BOTTOM',
                    icons: Array.isArray(obj.i) && obj.i.length ? obj.i.map(icon => ({ ...icon, id: uuidv4() })) : [
                        { id: uuidv4(), name: 'FaStar', size: 60, x: -40, y: 0, color: '#000000', rotation: 0 },
                        { id: uuidv4(), name: 'FaHeart', size: 60, x: 20, y: 40, color: '#000000', rotation: 0 },
                    ],
                    bgMode: obj.m || 'unicolor',
                    bgColor: obj.c || '#E2001A',
                    gradientColor1: obj.g1 || '#E2001A',
                    gradientColor2: obj.g2 || '#ffffff',
                    gradientDir: obj.d || 'horizontal',
                    brimColor: obj.r || '#000000',
                    textColor: obj.x || '#ffffff',
                };
            } else {
                // Old format (long keys)
                return {
                    topText: obj.topText || 'TOP',
                    bottomText: obj.bottomText || 'BOTTOM',
                    icons: Array.isArray(obj.icons) && obj.icons.length ? obj.icons.map(icon => ({ ...icon, id: uuidv4() })) : [
                        { id: uuidv4(), name: 'FaStar', size: 60, x: -40, y: 0, color: '#000000', rotation: 0 },
                        { id: uuidv4(), name: 'FaHeart', size: 60, x: 20, y: 40, color: '#000000', rotation: 0 },
                    ],
                    bgMode: obj.bgMode || 'unicolor',
                    bgColor: obj.bgColor || '#E2001A',
                    gradientColor1: obj.gradientColor1 || '#E2001A',
                    gradientColor2: obj.gradientColor2 || '#ffffff',
                    gradientDir: obj.gradientDir || 'horizontal',
                    brimColor: obj.brimColor || '#000000',
                    textColor: obj.textColor || '#ffffff',
                };
            }
        } catch {
            return null;
        }
    }, []);

    // --- Hydrate state from hash if present ---
    let initialState = null;
    if (typeof window !== 'undefined' && window.location.hash.length > 1) {
        initialState = deserializeState(window.location.hash.slice(1));
    }

    // --- State ---
    const [topText, setTopText] = useState(initialState ? initialState.topText : 'TOP');
    const [bottomText, setBottomText] = useState(initialState ? initialState.bottomText : 'BOTTOM');
    const [icons, setIcons] = useState(initialState ? initialState.icons : [
        { id: uuidv4(), name: 'FaStar', size: 60, x: -40, y: 0, color: '#000000', rotation: 0 },
        { id: uuidv4(), name: 'FaHeart', size: 60, x: 20, y: 40, color: '#000000', rotation: 0 },
    ]);
    const [bgMode, setBgMode] = useState(initialState ? initialState.bgMode : 'unicolor');
    const [bgColor, setBgColor] = useState(initialState ? initialState.bgColor : '#E2001A');
    const [gradientColor1, setGradientColor1] = useState(initialState ? initialState.gradientColor1 : '#E2001A');
    const [gradientColor2, setGradientColor2] = useState(initialState ? initialState.gradientColor2 : '#ffffff');
    const [gradientDir, setGradientDir] = useState(initialState ? initialState.gradientDir : 'horizontal');
    const [brimColor, setBrimColor] = useState(initialState ? initialState.brimColor : '#000000');
    const [textColor, setTextColor] = useState(initialState ? initialState.textColor : '#ffffff');



    // --- Sync state to URL ---
    const didMount = useRef(false);
    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        const state = {
            topText, bottomText, icons, bgMode, bgColor, gradientColor1, gradientColor2, gradientDir, brimColor, textColor
        };
        const hash = serializeState(state);
        if (window.location.hash !== '#' + hash) {
            window.history.replaceState(null, '', '#' + hash);
        }
    }, [topText, bottomText, icons, bgMode, bgColor, gradientColor1, gradientColor2, gradientDir, brimColor, textColor, serializeState]);



    // SVG gradient definition for 4-corner gradient
    // We'll use an SVG linearGradient with multiple stops to approximate a 4-corner gradient
    // (true 4-corner gradients require SVG mesh gradients, which have limited support)
    // We'll blend two linear gradients for a close effect

    return (
        <div className="flex w-screen h-screen bg-base-100 overflow-hidden">
            {/* Sidebar Settings Panel (Left) */}
            <aside className="flex flex-col h-full max-w-1/3 bg-base-200 overflow-y-auto overflow-x-hidden px-4 border-r">
                {/* Fixed header */}
                <div className="sticky top-0 z-10 bg-base-200 pb-2 pt-4">
                    <h2 className="text-lg font-bold mb-4 text-base-content">SVG Badge Generator</h2>
                </div>
                {/* Scrollable content */}
                <div className="flex flex-col flex-1 space-y-6">
                    {/* Text Section */}
                    <section>
                        <h3 className='text-sm font-semibold text-base-content/70 uppercase tracking-widest'>Text</h3>
                        <div>
                            <fieldset className="fieldset">
                                <legend className='fieldset-legend'>Top Text</legend>
                                <input
                                    value={topText}
                                    onChange={e => setTopText(e.target.value)}
                                    className="input input-lg"
                                    placeholder="Enter top text"
                                />
                            </fieldset>
                            <fieldset className="fieldset">
                                <legend className='fieldset-legend'>Bottom Text</legend>
                                <input
                                    value={bottomText}
                                    onChange={e => setBottomText(e.target.value)}
                                    className="input input-lg"
                                    placeholder="Enter bottom text"
                                />
                            </fieldset>
                            <fieldset className="fieldset center">
                                <legend className='fieldset-legend'>Text Color</legend>
                                <div className="flex justify-center items-center w-full">
                                    <input
                                        type="color"
                                        value={textColor}
                                        onChange={e => setTextColor(e.target.value)}
                                        className="input input-sm w-20 h-10 p-1"
                                    />
                                </div>
                            </fieldset>
                        </div>
                    </section>
                    <div className="divider"></div>
                    {/* Badge Colors Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-widest mb-4">Badge Colors</h3>
                        <div className="mb-2">
                            <label className="label cursor-pointer">
                                <input
                                    type="radio"
                                    name="bgMode"
                                    className="radio radio-primary mr-2"
                                    checked={bgMode === 'unicolor'}
                                    onChange={() => setBgMode('unicolor')}
                                />
                                <span className="label-text mr-4">Unicolor</span>
                                <input
                                    type="radio"
                                    name="bgMode"
                                    className="radio radio-primary mr-2"
                                    checked={bgMode === 'gradient'}
                                    onChange={() => setBgMode('gradient')}
                                />
                                <span className="label-text">Gradient</span>
                            </label>
                        </div>
                        {bgMode === 'unicolor' ? (
                            <div>
                                <label className="label">
                                    <span className="label-text">Background Color</span>
                                </label>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={e => setBgColor(e.target.value)}
                                    className="input input-sm w-20 h-10 p-1"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-4 items-center">
                                    <label className="label"><span className="label-text">Color 1</span></label>
                                    <input
                                        type="color"
                                        value={gradientColor1}
                                        onChange={e => setGradientColor1(e.target.value)}
                                        className="input input-sm w-20 h-10 p-1"
                                    />
                                    <label className="label ml-4"><span className="label-text">Color 2</span></label>
                                    <input
                                        type="color"
                                        value={gradientColor2}
                                        onChange={e => setGradientColor2(e.target.value)}
                                        className="input input-sm w-20 h-10 p-1"
                                    />
                                </div>
                                <div className="flex gap-4 items-center mt-2">
                                    <label className="label"><span className="label-text">Direction</span></label>
                                    <select
                                        className="select select-sm"
                                        value={gradientDir}
                                        onChange={e => setGradientDir(e.target.value)}
                                    >
                                        <option value="horizontal">Horizontal (→)</option>
                                        <option value="vertical">Vertical (↓)</option>
                                        <option value="diagonal1">Diagonal (↘)</option>
                                        <option value="diagonal2">Diagonal (↗)</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <label className="label mt-4">
                            <span className="label-text">Brim Color</span>
                        </label>
                        <input
                            type="color"
                            value={brimColor}
                            onChange={e => setBrimColor(e.target.value)}
                            className="input input-sm w-20 h-10 p-1"
                        />
                    </section>
                    <div className="divider"></div>
                    {/* Icons Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-widest mb-4">Icons</h3>
                        <div className="">
                            {icons.map((icon, idx) => (
                                <IconEditor
                                    key={icon.id}
                                    icon={icon}
                                    index={idx}
                                    canRemove={icons.length > 1}
                                    onRemove={() => setIcons(icons.filter(i => i.id !== icon.id))}
                                    onChange={updatedIcon => setIcons(icons.map(i => i.id === icon.id ? updatedIcon : i))}
                                />
                            ))}
                            <button
                                className="btn btn-primary mt-4"
                                onClick={() => setIcons([
                                    ...icons,
                                    { id: uuidv4(), name: 'FaStar', size: 60, x: 0, y: 0, color: '#000', rotation: 0 },
                                ])}
                            >
                                <FaPlus /> Add Icon
                            </button>
                        </div>
                    </section>
                </div>
            </aside>
            {/* Badge Preview (Right) */}
            <main className="flex-1 flex items-center justify-center h-full w-full bg-base-100 overflow-hidden">
                <div className="hero min-h-full">
                    <div className="hero-content">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body p-8">
                                <svg width="340" height="340" viewBox="0 0 340 340">
                                    <defs>
                                        {/* Gradient definition if needed */}
                                        {bgMode !== 'unicolor' && (
                                            <linearGradient id="badgeGradient"
                                                x1={gradientDir === 'horizontal' ? '0%' : gradientDir === 'vertical' ? '0%' : gradientDir === 'diagonal1' ? '0%' : '100%'}
                                                y1={gradientDir === 'horizontal' ? '0%' : gradientDir === 'vertical' ? '0%' : gradientDir === 'diagonal1' ? '0%' : '0%'}
                                                x2={gradientDir === 'horizontal' ? '100%' : gradientDir === 'vertical' ? '0%' : gradientDir === 'diagonal1' ? '100%' : '0%'}
                                                y2={gradientDir === 'horizontal' ? '0%' : gradientDir === 'vertical' ? '100%' : gradientDir === 'diagonal1' ? '100%' : '100%'}
                                            >
                                                <stop offset="0%" stopColor={gradientColor1} />
                                                <stop offset="100%" stopColor={gradientColor2} />
                                            </linearGradient>
                                        )}
                                        {/* Clip path for icons to stay inside the inner circle */}
                                        <clipPath id="iconClip">
                                            <circle cx="170" cy="170" r="120" />
                                        </clipPath>
                                    </defs>
                                    {/* Outer black ring */}
                                    <circle cx="170" cy="170" r="160" fill={brimColor} />
                                    {/* Inner colored circle (smaller to create a thick brim) */}
                                    {bgMode === 'unicolor' ? (
                                        <circle cx="170" cy="170" r="120" fill={bgColor} />
                                    ) : (
                                        <circle cx="170" cy="170" r="120" fill="url(#badgeGradient)" />
                                    )}
                                    {/* Top curved text: semicircle arc, left to right (top half, radius 140) */}
                                    <path id="topCurve" d="M 30,170 A 140,140 0 0 1 310,170" fill="none" />
                                    {/* Bottom curved text: semicircle arc, left to right (bottom half, radius 140) */}
                                    <path id="bottomCurve" d="M 30,170 A 140,140 0 0 0 310,170" fill="none" />
                                    <text fontSize="24" fontWeight="bold" fill={textColor} letterSpacing="2">
                                        <textPath href="#topCurve" startOffset="50%" textAnchor="middle" dominantBaseline="middle">
                                            {topText}
                                        </textPath>
                                    </text>
                                    <text fontSize="24" fontWeight="bold" fill={textColor} letterSpacing="2">
                                        <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle" dominantBaseline="middle">
                                            {bottomText}
                                        </textPath>
                                    </text>
                                    {/* Center icons, stacked, clipped to inner circle */}
                                    <g clipPath="url(#iconClip)">
                                        <g transform="translate(170,170)">
                                            {icons.map(icon => {
                                                const IconComp = getIconComponent(icon.name);
                                                // Offset by -size/2 so the icon's center is at (x, y) relative to badge center
                                                const offset = -icon.size / 2;
                                                return IconComp ? (
                                                    <g
                                                        key={icon.id}
                                                        transform={`translate(${icon.x + offset},${icon.y + offset}) rotate(${icon.rotation || 0} ${icon.size / 2} ${icon.size / 2})`}
                                                    >
                                                        <IconComp size={icon.size} color={icon.color} />
                                                    </g>
                                                ) : null;
                                            })}
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
