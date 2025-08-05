


import { useState } from 'react';
import AsyncIconSelect from './AsyncIconSelect';
import IconEditor from './IconEditor';
import { getIconComponent } from './IconUtils';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus } from 'react-icons/fa';


export default function BadgeEditor() {
    const [topText, setTopText] = useState('ENGINEERING');
    const [bottomText, setBottomText] = useState('DESIGN SQUAD');
    const [icons, setIcons] = useState([
        { id: uuidv4(), name: 'FaStar', size: 60, x: -40, y: 0, color: '#111' },
        { id: uuidv4(), name: 'FaHeart', size: 60, x: 20, y: 40, color: '#111' },
    ]);
    const [bgColor, setBgColor] = useState('#e53935');
    const [brimColor, setBrimColor] = useState('#111');
    // Removed global iconColor, now per-icon
    const [textColor, setTextColor] = useState('#fff');

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
                            <label className="label">
                                <span className="label-text">Brim Color</span>
                            </label>
                            <input
                                type="color"
                                value={brimColor}
                                onChange={e => setBrimColor(e.target.value)}
                                className="input input-sm w-20 h-10 p-1"
                            />
                        </div>
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
                                    { id: uuidv4(), name: 'FaStar', size: 60, x: 0, y: 0, color: '#000' },
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
                                    {/* Outer black ring */}
                                    <circle cx="170" cy="170" r="160" fill={brimColor} />
                                    {/* Inner colored circle (smaller to create a thick brim) */}
                                    <circle cx="170" cy="170" r="120" fill={bgColor} />
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
                                    {/* Center icons, stacked */}
                                    <g>
                                        <g transform="translate(170,170)">
                                            {icons.map(icon => {
                                                const IconComp = getIconComponent(icon.name);
                                                // Offset by -size/2 so the icon's center is at (x, y) relative to badge center
                                                const offset = -icon.size / 2;
                                                return IconComp ? (
                                                    <g key={icon.id} transform={`translate(${icon.x + offset},${icon.y + offset})`}>
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
