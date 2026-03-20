import { useEffect, useRef } from "react";
const ParticleField = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let animId;
        const particles = [];
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -Math.random() * 0.5 - 0.1,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.5 ? "#FFD60A" : "#00D4FF",
            });
        }
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -10 || p.x > canvas.width + 10)
                    p.x = Math.random() * canvas.width;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                // glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                g.addColorStop(0, p.color);
                g.addColorStop(1, "transparent");
                ctx.fillStyle = g;
                ctx.globalAlpha = p.alpha * 0.3;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(animate);
        };
        animate();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0"/>;
};
export default ParticleField;
