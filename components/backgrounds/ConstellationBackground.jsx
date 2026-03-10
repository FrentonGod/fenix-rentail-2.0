import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, Circle, Line } from 'react-native-svg';

// Ligero fondo tipo "constelación": puntos y líneas con sutil animación
// Pensado para ser absolutamente posicionado detrás de contenido, sin capturar toques
export default function ConstellationBackground({ width = 800, height = 600, color = '#6F09EA' }) {
  const nodeCount = Math.min(30, Math.max(18, Math.floor((width * height) / 35000))); // escala con tamaño
  const maxLinkDist = Math.min(width, height) / 6; // distancia máxima para conectar
  const speed = 0.15; // velocidad de oscilación

  const nodesRef = useRef([]);
  const [tick, setTick] = useState(0);

  // Inicializar nodos solo una vez
  if (nodesRef.current.length === 0) {
    nodesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.1 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      amp: 6 + Math.random() * 10,
    }));
  }

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), Platform.OS === 'web' ? 50 : 80);
    return () => clearInterval(interval);
  }, []);

  // Calcular posiciones levemente desplazadas sin mutar base
  const animated = useMemo(() => {
    const t = tick * speed;
    return nodesRef.current.map((n, idx) => ({
      x: n.x + Math.sin(t + n.phase + idx) * n.amp * 0.12,
      y: n.y + Math.cos(t * 0.9 + n.phase + idx * 0.33) * n.amp * 0.12,
      r: n.r,
    }));
  }, [tick]);

  // Precalcular líneas dentro de la distancia
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < animated.length; i++) {
      for (let j = i + 1; j < animated.length; j++) {
        const dx = animated[i].x - animated[j].x;
        const dy = animated[i].y - animated[j].y;
        const d = Math.hypot(dx, dy);
        if (d < maxLinkDist) {
          const alpha = 0.35 * (1 - d / maxLinkDist); // más cerca, más opaco
          arr.push({ i, j, alpha });
        }
      }
    }
    return arr;
  }, [animated, maxLinkDist]);

  const bgFrom = `${color}20`; // 12% opacidad
  const bgTo = `${color}05`;   // 2% opacidad
  const dot = color;
  const line = color;

  return (
    <Svg width={width} height={height} pointerEvents="none">
      <Defs>
        <SvgLinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={bgFrom} />
          <Stop offset="100%" stopColor={bgTo} />
        </SvgLinearGradient>
      </Defs>
      {/* Degradado de fondo muy suave */}
      <Rect x={0} y={0} width={width} height={height} fill="url(#bg)" />

      {/* Líneas entre nodos cercanos */}
      {lines.map((l, idx) => (
        <Line
          key={`l-${idx}`}
          x1={animated[l.i].x}
          y1={animated[l.i].y}
          x2={animated[l.j].x}
          y2={animated[l.j].y}
          stroke={line}
          strokeOpacity={l.alpha}
          strokeWidth={1}
        />
      ))}

      {/* Nodos */}
      {animated.map((n, idx) => (
        <Circle key={`c-${idx}`} cx={n.x} cy={n.y} r={n.r} fill={dot} fillOpacity={0.7} />)
      )}
    </Svg>
  );
}
