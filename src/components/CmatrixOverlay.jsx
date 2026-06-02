import React, { useEffect, useRef } from 'react';

export default function CmatrixOverlay({ onClose }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;
        const fontSize = 16;
        let columns = 0;
        let rainDrops = [];

        const initCanvas = () => {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            columns = canvas.width / fontSize;
            rainDrops = [];
            for (let x = 0; x < columns; x++) {
                rainDrops[x] = 1;
            }
        };

        initCanvas();

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const interval = setInterval(draw, 30);

        const resizeObserver = new ResizeObserver(() => {
            initCanvas();
        });
        resizeObserver.observe(parent);

        return () => {
            clearInterval(interval);
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'q' || e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div 
            className="absolute inset-0 z-[200] bg-black cursor-default select-none rounded-xl overflow-hidden"
            onClick={onClose}
        >
            <canvas ref={canvasRef} className="block w-full h-full" />
            <div className="absolute top-4 right-4 text-green-500 font-mono text-sm opacity-50">
                Press 'q' or 'Ctrl+C' to exit
            </div>
        </div>
    );
}
