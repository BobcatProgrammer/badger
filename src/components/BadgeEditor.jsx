


import { useState } from 'react';
import AsyncIconSelect from './AsyncIconSelect';
import IconEditor from './IconEditor';
import { getIconComponent } from './IconUtils';
import './BadgeEditor.css';
import { v4 as uuidv4 } from 'uuid';


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
        <div className="flex w-screen h-screen overflow-hidden">
            {/* Sidebar Settings Panel (Left) */}
            <aside
                className="flex flex-col h-full max-width-md overflow-y-auto overflow-x-hidden px-5"
            >
                <div className="flex flex-col gap-8 flex-1">
                    {/* Text Section */}
                    <section>
                        <h3 className="uppercase">Text</h3>
                        <div className="flex flex-col gap-3">
                            <label className="font-medium">Top Text</label>
                            <input value={topText} onChange={e => setTopText(e.target.value)} className="input input-bordered input-primary w-full bg-neutral-700 text-neutral-100 border-neutral-600" />
                            <label className="font-medium">Bottom Text</label>
                            <input value={bottomText} onChange={e => setBottomText(e.target.value)} className="input input-bordered input-primary w-full bg-neutral-700 text-neutral-100 border-neutral-600" />
                            <label className="font-medium">Text Color</label>
                            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="input input-xs p-0 h-8 w-16 border-none bg-transparent" />
                        </div>
                    </section>
                    {/* Icons Section */}
                    <section>
                        <h3 className="uppercase text-xs font-semibold text-neutral-400 mb-3 tracking-widest">Icons</h3>
                        <div className="flex flex-col gap-4 mt-2">
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
                                className="btn btn-primary btn-sm mt-2"
                                onClick={() => setIcons([
                                    ...icons,
                                    { id: uuidv4(), name: 'FaStar', size: 60, x: 0, y: 0, color: '#111' },
                                ])}
                            >
                                + Add Icon
                            </button>
                        </div>
                    </section>
                    {/* Badge Colors Section */}
                    <section>
                        <h3 className="uppercase text-xs font-semibold text-neutral-400 mb-3 tracking-widest">Badge Colors</h3>
                        <div className="flex flex-col gap-3">
                            <label className="font-medium">Background Color</label>
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="input input-xs p-0 h-8 w-16 border-none bg-transparent" />
                            <label className="font-medium">Brim Color</label>
                            <input type="color" value={brimColor} onChange={e => setBrimColor(e.target.value)} className="input input-xs p-0 h-8 w-16 border-none bg-transparent" />
                        </div>
                    </section>
                </div>
            </aside>
            {/* Badge Preview (Right) */}
            <main className="flex-1 flex items-center justify-center h-full w-full overflow-hidden">
                <div className="flex flex-col items-center justify-center w-full h-full" style={{ minHeight: 0, minWidth: 0 }}>
                    <div className="flex items-center justify-center w-full h-full" style={{ minHeight: 0, minWidth: 0 }}>
                        <div className="card bg-base-200 shadow-xl flex items-center justify-center p-8 max-h-[90vh] max-w-[90vw]">
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
                                    <g transform="translate(170,150)">
                                        {icons.map(icon => {
                                            const IconComp = getIconComponent(icon.name);
                                            return IconComp ? (
                                                <g key={icon.id} transform={`translate(${icon.x},${icon.y})`}>
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
            </main>
        </div>
    );
}
