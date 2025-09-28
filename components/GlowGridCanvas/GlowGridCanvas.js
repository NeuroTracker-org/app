import { useEffect, useRef, useState } from 'react';
import styles from './GlowGridCanvas.module.css';

const GlowGridCanvas = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ mouseX: -1000, mouseY: -1000 });
  const [mounted, setMounted] = useState(false);

  const gridSize = 140;
  const borderSize = 1;

  // === Fonctions de dessin ===
  const drawGridWithStroke = (ctx, width, height) => {
    const rows = Math.ceil(height / gridSize);
    const cols = Math.ceil(width / gridSize);

    ctx.strokeStyle = '#13171e';
    ctx.lineWidth = borderSize;

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = col * gridSize;
        const y = row * gridSize;
        ctx.strokeRect(x, y, gridSize, gridSize);
      }
    }
  };

  const drawGridWithFill = (ctx, width, height) => {
    const rows = Math.ceil(height / gridSize);
    const cols = Math.ceil(width / gridSize);

    ctx.fillStyle = 'rgba(16, 19, 25, 0.98)';

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = col * gridSize + borderSize;
        const y = row * gridSize + borderSize;
        const squareSize = gridSize - 2 * borderSize;
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }
  };

  const drawCursor = (ctx) => {
    ctx.save();

    const gradient = ctx.createRadialGradient(
      mousePos.mouseX,
      mousePos.mouseY,
      10,
      mousePos.mouseX,
      mousePos.mouseY,
      200
    );
    gradient.addColorStop(0, 'rgba(5,100,255, 0.7)');
    gradient.addColorStop(1, 'rgba(5,100,255, 0)');

    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(mousePos.mouseX, mousePos.mouseY, 200, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawGridWithDots = (ctx, width, height) => {
    const rows = Math.ceil(height / gridSize);
    const cols = Math.ceil(width / gridSize);

    ctx.fillStyle = '#00368f';

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = col * gridSize;
        const y = row * gridSize;
        const dotRadius = 1.5;

        for (const [dx, dy] of [
          [0, 0],
          [gridSize, 0],
          [0, gridSize],
          [gridSize, gridSize],
        ]) {
          ctx.beginPath();
          ctx.arc(x + dx, y + dy, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const drawScene = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
    drawGridWithStroke(ctx, width, height);
    drawCursor(ctx);
    drawGridWithFill(ctx, width, height);
    drawGridWithDots(ctx, width, height);
  };

  // === Effets ===
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawScene(ctx, canvas.width, canvas.height);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        mouseX: e.clientX - rect.left,
        mouseY: e.clientY - rect.top,
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawScene(ctx, canvas.width, canvas.height);
  }, [mousePos, mounted]);

  if (!mounted) return null;

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        id="glowGridCanvas"
        style={{ display: 'block', width: '100%', height: '100vh' }}
      ></canvas>
    </div>
  );
};

export default GlowGridCanvas;
