import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkle } from 'lucide-react';

interface ThreeDRobotProps {
  userEmail?: string;
}

export default function ThreeDRobot({ userEmail }: ThreeDRobotProps) {
  // High fidelity 3D Rotational angles
  const [rotation, setRotation] = useState({ x: 8, y: -24 });
  const [isDraggingRotation, setIsDraggingRotation] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });
  
  const [autoRotate, setAutoRotate] = useState(true);

  // --- CURSOR TRACKING COGNITIVE EYES ---
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Translucent x-ray shell to look at the learning brain *inside*
  const [translucentBrainShell, setTranslucentBrainShell] = useState<boolean>(false);
  
  // Continuous Brain Progress Simulation
  const [learningProgress, setLearningProgress] = useState<number>(42);

  // --- INTEGRATED INTERACTIVE EMOTE SYSTEM ---
  const [emote, setEmote] = useState<'normal' | 'happy' | 'love' | 'shock' | 'angry'>('normal');
  const [showEmoteBubble, setShowEmoteBubble] = useState<boolean>(true);
  const [particles, setParticles] = useState<{ id: number; char: string; left: number; delay: number }[]>([]);

  useEffect(() => {
    let emoji = '✨';
    if (emote === 'love') emoji = '❤️';
    else if (emote === 'shock') emoji = '⚡';
    else if (emote === 'angry') emoji = '🔥';
    else if (emote === 'happy') emoji = '✨';
    else if (emote === 'normal') emoji = '⚙️';

    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      char: emoji,
      left: 15 + Math.random() * 70,
      delay: i * 0.3
    }));
    setParticles(newParticles);

    setShowEmoteBubble(true);
    const bubbleTimer = setTimeout(() => {
      setShowEmoteBubble(false);
    }, 4500);

    return () => clearTimeout(bubbleTimer);
  }, [emote]);

  useEffect(() => {
    const handlePointerMoveGlobal = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxOffset = 6.0; // wider range of movement for realistic expressive eyes
      
      if (distance === 0) {
        setEyeOffset({ x: 0, y: 0 });
      } else {
        const clampFactor = Math.min(distance / 180, 1);
        const ox = (dx / distance) * maxOffset * clampFactor;
        const oy = (dy / distance) * maxOffset * clampFactor;
        setEyeOffset({ x: ox, y: oy });
      }
    };

    const handleMouse = (e: MouseEvent) => {
      handlePointerMoveGlobal(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        handlePointerMoveGlobal(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  // Simulator brain progress
  useEffect(() => {
    const learningTimer = setInterval(() => {
      setLearningProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 450);

    return () => {
      clearInterval(learningTimer);
    };
  }, []);

  // Gentle automatic orbital spin if idle
  useEffect(() => {
    if (!autoRotate || isDraggingRotation) return;
    let animFrame: number;
    const speed = 0.4;
    const tick = () => {
      setRotation(prev => ({
        ...prev,
        y: (prev.y + speed) % 360
      }));
      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [autoRotate, isDraggingRotation]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingRotation(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotationStart.current = { x: rotation.x, y: rotation.y };
    setAutoRotate(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRotation) return;
    e.stopPropagation();
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    setRotation({
      x: Math.max(-60, Math.min(60, rotationStart.current.x - deltaY * 0.9)),
      y: rotationStart.current.y + deltaX * 1.1
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDraggingRotation(false);
  };

  const handleViewportClick = () => {
    if (isDraggingRotation) return;
    setTranslucentBrainShell(prev => !prev);
  };

  const getMoodBorder = () => {
    if (translucentBrainShell) {
      return 'border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.35)]';
    }
    return 'border-amber-400/30 hover:border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
  };

  return (
    <motion.div
      id="3d_fixed_robot_container"
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-6 right-6 z-50 p-2.5 select-none touch-none w-[160px] flex flex-col items-center transition-all duration-300"
      title={translucentBrainShell ? "Click to restore outer toy armor shell" : "Click to view inner translucent brain matrix!"}
    >
      {/* --- MAIN 3D MODEL VIEWPORT WITH PERSPECTIVE --- */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleViewportClick}
        className={`w-full h-[170px] flex items-center justify-center relative touch-none select-none overflow-visible cursor-pointer`}
        style={{ 
          perspective: '700px',
          perspectiveOrigin: '50% 50%' 
        }}
      >
        {/* Soft Ambient shadow & Pulsing Neon Ground Glow under robot */}
        <div 
          className="absolute bottom-1 w-24 h-4 rounded-full pointer-events-none"
          style={{
            transform: `rotateX(82deg) scale(${isDraggingRotation ? 0.9 : 1.1})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Physical Ambient occlusion shadow */}
          <div className="absolute inset-0 bg-black/70 rounded-full blur-[3px]" />
          
          {/* Soft outer neon aura */}
          <div 
            className="absolute inset-[-6px] rounded-full blur-[14px] opacity-70 animate-pulse transition-all duration-300"
            style={{
              backgroundColor: translucentBrainShell ? 'rgba(6, 182, 212, 0.45)' : 'rgba(245, 158, 11, 0.45)',
              boxShadow: translucentBrainShell 
                ? '0 0 25px rgba(6, 182, 212, 0.6), 0 0 50px rgba(6, 182, 212, 0.3)' 
                : '0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(245, 158, 11, 0.3)',
              animationDuration: '1.8s'
            }}
          />
          
          {/* Intense hot core Projection spot */}
          <div 
            className="absolute inset-[3px] rounded-full blur-[5px] opacity-85 animate-pulse transition-all duration-300"
            style={{
              backgroundColor: translucentBrainShell ? 'rgba(34, 211, 238, 0.9)' : 'rgba(251, 191, 36, 0.9)',
              boxShadow: translucentBrainShell 
                ? '0 0 10px rgba(34, 211, 238, 1)' 
                : '0 0 10px rgba(251, 191, 36, 1)',
              animationDuration: '1.2s'
            }}
          />
        </div>

        {/* Glowing Holographic Column for translucent mode */}
        {translucentBrainShell && (
          <div className="absolute top-2 bottom-6 w-14 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 pointer-events-none animate-pulse" />
        )}

        {/* --- COMPLEX 3D ROBOT STRUCTURAL ASSEMBLAGE --- */}
        <div
          className="relative w-24 h-32 flex flex-col items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Custom style keyframes for floating and magnetic sci-fi effects */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes roboHeadFloat_custom {
              0%, 100% {
                transform: translateY(-30px) rotateX(1.5deg) rotateY(1deg);
              }
              50% {
                transform: translateY(-36px) rotateX(-2deg) rotateY(-1deg);
              }
            }
            @keyframes energyRingPulse {
              0%, 100% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(0.85);
                opacity: 0.55;
                box-shadow: 0 0 10px rgba(0, 240, 255, 0.45), inset 0 0 8px rgba(0, 240, 255, 0.3);
              }
              50% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(1.05);
                opacity: 0.95;
                box-shadow: 0 0 20px rgba(0, 240, 255, 0.85), inset 0 0 12px rgba(0, 240, 255, 0.6);
              }
            }
            @keyframes amberEnergyRingPulse {
              0%, 100% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(0.85);
                opacity: 0.55;
                box-shadow: 0 0 10px rgba(245, 158, 11, 0.45), inset 0 0 8px rgba(245, 158, 11, 0.3);
              }
              50% {
                transform: translateY(2px) translateZ(0) rotateX(90deg) scale(1.05);
                opacity: 0.95;
                box-shadow: 0 0 20px rgba(245, 158, 11, 0.85), inset 0 0 12px rgba(245, 158, 11, 0.6);
              }
            }
          `}} />

          {/* === FLOATING HEAD ASSEMBLY (Bobbing in sync above the body) === */}
          <div 
            className="absolute"
            style={{
              width: '74px',
              height: '52px',
              transformStyle: 'preserve-3d',
              animation: 'roboHeadFloat_custom 3.2s ease-in-out infinite',
              pointerEvents: 'none'
            }}
          >
            {/* === 1. TOP ANTENNA (Realistic Milled Chrome Mast + Glowing Gem) === */}
            <div 
              className="absolute" 
              style={{ 
                left: '29px', // Center: (74 - 16)/2 = 29px
                transform: 'translateY(-41px) translateZ(0px)', 
                transformStyle: 'preserve-3d',
                pointerEvents: 'auto'
              }}
            >
              {/* CNC Beveled Antenna Mount */}
              <div 
                className="w-5 h-2 rounded-t-[3px] border-b border-black/40 shadow-[0_1.5px_2px_rgba(0,0,0,0.4)]" 
                style={{ 
                  background: 'linear-gradient(to right, #4b5563, #374151, #1f2937)',
                  transform: 'translateZ(-1px)' 
                }} 
              />
              {/* Polished steel mast with light highlights */}
              <div 
                className="w-1.5 h-6 mx-auto relative shadow-[1px_0_2px_rgba(0,0,0,0.3)]" 
                style={{
                  background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 45%, #4b5563 80%, #374151 100%)'
                }}
              >
                {/* Highlight line on chrome */}
                <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/40" />
              </div>
              {/* Dynamic Signal Transmitter Dome */}
              <div 
                className="w-[16px] h-[16px] rounded-full transition-all duration-300"
                style={{
                  background: translucentBrainShell 
                    ? 'radial-gradient(circle at 35% 35%, #9ffff3 0%, #00f0ff 45%, #0e7490 85%, #083344 100%)' 
                    : 'radial-gradient(circle at 35% 35%, #fffbeb 0%, #fbbf24 35%, #d97706 70%, #78350f 100%)',
                  boxShadow: translucentBrainShell 
                    ? '0 0 15px #00f0ff, 0 0 5px rgba(0,240,255,0.5), inset -2.5px -2.5px 5px rgba(0,0,0,0.55)' 
                    : '0 2.5px 6px rgba(0,0,0,0.4), 0 0 10px rgba(217,119,6,0.3), inset -2.5px -2.5px 5px rgba(0,0,0,0.65)',
                  transform: 'translateY(-2px)'
                }}
              />
            </div>

            {/* === 2. HIGHLY ROUNDED 3D TOY HEAD (With Premium Metal Shading) === */}
            <div 
              className="absolute inset-0"
              style={{
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d',
                pointerEvents: 'auto'
              }}
            >
              {/* HEAD INTERNAL SOLID FILLERS (Weighted 3D interior to hide light seams) */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '74px',
                  height: '52px',
                  transform: 'translateZ(0px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* XY Plane (Metallic blocker) */}
                <div 
                  className="absolute inset-[1px] transition-all duration-300"
                  style={{
                    background: translucentBrainShell 
                      ? 'rgba(0, 240, 255, 0.12)' 
                      : 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
                    borderRadius: '8px',
                    transform: 'translateZ(0px)'
                  }}
                />
                {/* YZ Plane (Sides blocker) */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    width: '50px',
                    height: '50px',
                    left: '12px',
                    top: '1px',
                    background: translucentBrainShell 
                      ? 'rgba(0, 240, 255, 0.12)' 
                      : 'linear-gradient(to bottom, #d97706, #78350f)',
                    borderRadius: '8px',
                    transform: 'rotateY(90deg)'
                  }}
                />
                {/* XZ Plane (Bottom blocker) */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    width: '72px',
                    height: '50px',
                    left: '1px',
                    top: '1px',
                    background: translucentBrainShell 
                      ? 'rgba(0, 240, 255, 0.15)' 
                      : '#78350f',
                    borderRadius: '8px',
                    transform: 'rotateX(90deg)'
                  }}
                />
              </div>

              {/* HEAD SHELL: FRONT VISOR FACE */}
              <div 
                className="absolute inset-0 rounded-[9px] p-[2.5px] flex items-center justify-center transition-all duration-300"
                style={{ 
                  transform: 'translateZ(26px)', 
                  transformStyle: 'preserve-3d', 
                  backfaceVisibility: 'hidden',
                  background: translucentBrainShell 
                    ? 'rgba(0, 240, 255, 0.22)' 
                    : 'linear-gradient(135deg, #ffe082 0%, #fbbf24 25%, #d97706 65%, #92400e 100%)',
                  border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f',
                  boxShadow: translucentBrainShell 
                    ? 'inset 0 0 14px rgba(0,240,255,0.7)' 
                    : 'inset 2.5px 2.5px 4px rgba(255,255,255,0.5), inset -2.5px -2.5px 5px rgba(0,0,0,0.55), 0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                {/* CNC Chamfered bezel track */}
                <div className="w-full h-full rounded-[7px] bg-[#0c101d] border-[1.5px] border-[#080a13] p-1.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)]">
                  {/* Advanced Curved CRT Glare Overlay + Subtle Scanlines */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-30" 
                    style={{
                      background: 'linear-gradient(105deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 20%, transparent 21%, transparent 75%, rgba(255,255,255,0.03) 76%, rgba(255,255,255,0.06) 100%), repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 3px)'
                    }}
                  />
                  
                  {/* Micro Ambient Shadow overlay inside screen border */}
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />



                  {/* Highly prominent GLOWING BIG CIRCULAR EYES from the image */}
                  <div className="flex gap-2.5 justify-center items-center my-0.5 relative z-10 transition-transform duration-300">
                    {/* Left Eye Socket */}
                    <div className="w-[21px] h-[28px] flex items-center justify-center relative">
                      {/* Moving Iris & Pupil (moves with eyeOffset) */}
                      <div 
                        className="w-[19px] h-[25px] rounded-[50%] transition-all duration-75 relative flex items-center justify-center select-none overflow-hidden"
                        style={{
                          background: '#ffffff',
                          boxShadow: emote === 'angry' 
                            ? '0 0 15px rgba(239, 68, 68, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)' 
                            : emote === 'love'
                            ? '0 0 15px rgba(244, 63, 94, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)'
                            : '0 0 15px rgba(56, 189, 248, 0.8), inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1.5px 3px rgba(0,0,0,0.08)',
                          transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                          transformStyle: 'preserve-3d font-sans'
                        }}
                      >
                        {/* Angry Eyebrow Overlay */}
                        {emote === 'angry' && (
                          <div className="absolute top-[2px] left-[-1px] w-5 h-[3px] bg-rose-700 rounded-sm z-30 rotate-[20deg]" />
                        )}

                        {/* Emote Custom Pupils */}
                        {emote === 'normal' && (
                          <div 
                            className="w-[8px] h-[12px] rounded-full bg-gradient-to-b from-[#38bdf8] to-[#1d4ed8] shadow-[inset_0.5px_1px_2px_rgba(255,255,255,0.45)] flex items-center justify-center absolute top-[5px] left-[6.5px]"
                            style={{
                              transform: 'rotate(12deg)'
                            }}
                          />
                        )}

                        {emote === 'happy' && (
                          <div className="w-[11px] h-[7px] border-t-3 border-b-0 border-x-0 border-emerald-600 rounded-t-full mt-[2px] z-20" />
                        )}

                        {emote === 'love' && (
                          <div className="text-[11px] text-rose-500 animate-pulse font-sans leading-none z-20">❤️</div>
                        )}

                        {emote === 'shock' && (
                          <div className="w-[10px] h-[10px] rounded-full bg-cyan-400 border border-white animate-ping absolute" />
                        )}

                        {emote === 'angry' && (
                          <div className="w-[7px] h-[9px] rounded-xs bg-gradient-to-b from-amber-500 to-red-600 top-[6px] absolute z-20" />
                        )}
                        
                        {/* Vibrant Light Blue Curved Crescent ring inside the iris */}
                        {emote === 'normal' && (
                          <div className="absolute bottom-[2px] inset-x-2 h-[3px] rounded-full bg-cyan-200/75 blur-[0.3px] pointer-events-none" />
                        )}

                        {/* CORNEA GLASS GLINT REFLECTIONS */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-[3px] left-[3.2px] w-[5.5px] h-[5.5px] rounded-full bg-white shadow-[0_0_2.5px_rgba(255,255,255,0.95)]" />
                          <div className="absolute bottom-[4.2px] right-[4.2px] w-[3px] h-[3px] rounded-full bg-white/90 shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
                        </div>
                      </div>
                    </div>

                    {/* Right Eye Socket */}
                    <div className="w-[21px] h-[28px] flex items-center justify-center relative">
                      {/* Moving Iris & Pupil (moves with eyeOffset) */}
                      <div 
                        className="w-[19px] h-[25px] rounded-[50%] transition-all duration-75 relative flex items-center justify-center select-none overflow-hidden"
                        style={{
                          background: '#ffffff',
                          boxShadow: emote === 'angry' 
                            ? '0 0 15px rgba(239, 68, 68, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)' 
                            : emote === 'love'
                            ? '0 0 15px rgba(244, 63, 94, 0.85), inset 0 2px 4px rgba(0,0,0,0.2)'
                            : '0 0 15px rgba(56, 189, 248, 0.8), inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1.5px 3px rgba(0,0,0,0.08)',
                          transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                          transformStyle: 'preserve-3d font-sans'
                        }}
                      >
                        {/* Angry Eyebrow Overlay */}
                        {emote === 'angry' && (
                          <div className="absolute top-[2px] right-[-1px] w-5 h-[3px] bg-rose-700 rounded-sm z-30 -rotate-[20deg]" />
                        )}

                        {/* Emote Custom Pupils */}
                        {emote === 'normal' && (
                          <div 
                            className="w-[8px] h-[12px] rounded-full bg-gradient-to-b from-[#38bdf8] to-[#1d4ed8] shadow-[inset_0.5px_1px_2px_rgba(255,255,255,0.45)] flex items-center justify-center absolute top-[5px] left-[4.5px]"
                            style={{
                              transform: 'rotate(-12deg)'
                            }}
                          />
                        )}

                        {emote === 'happy' && (
                          <div className="w-[11px] h-[7px] border-t-3 border-b-0 border-x-0 border-emerald-600 rounded-t-full mt-[2px] z-20" />
                        )}

                        {emote === 'love' && (
                          <div className="text-[11px] text-rose-500 animate-pulse font-sans leading-none z-20">❤️</div>
                        )}

                        {emote === 'shock' && (
                          <div className="w-[10px] h-[10px] rounded-full bg-cyan-400 border border-white animate-ping absolute" />
                        )}

                        {emote === 'angry' && (
                          <div className="w-[7px] h-[9px] rounded-xs bg-gradient-to-b from-amber-500 to-red-600 top-[6px] absolute z-20" />
                        )}
                        
                        {/* Vibrant Light Blue Curved Crescent ring inside the iris */}
                        {emote === 'normal' && (
                          <div className="absolute bottom-[2px] inset-x-2 h-[3px] rounded-full bg-cyan-200/75 blur-[0.3px] pointer-events-none" />
                        )}

                        {/* CORNEA GLASS GLINT REFLECTIONS */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-[3px] left-[3.2px] w-[5.5px] h-[5.5px] rounded-full bg-white shadow-[0_0_2.5px_rgba(255,255,255,0.95)]" />
                          <div className="absolute bottom-[4.2px] right-[4.2px] w-[3px] h-[3px] rounded-full bg-white/90 shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
                        </div>
                      </div>
                    </div>

                    {/* Highly polished blush spots utilizing sub-surface red glass look */}
                    <div className="absolute -bottom-1.5 inset-x-0 flex justify-between px-1.5 pointer-events-none z-20">
                      <div 
                        className={`w-[8px] h-[3px] rounded-full blur-[0.4px] animate-pulse transition-all duration-300 ${
                          emote === 'love' ? 'bg-rose-500' : emote === 'angry' ? 'bg-red-500 scale-125' : 'bg-rose-500/80'
                        }`} 
                        style={{ animationDuration: '1.2s' }} 
                      />
                      <div 
                        className={`w-[8px] h-[3px] rounded-full blur-[0.4px] animate-pulse transition-all duration-300 ${
                          emote === 'love' ? 'bg-rose-500' : emote === 'angry' ? 'bg-red-500 scale-125' : 'bg-rose-500/80'
                        }`} 
                        style={{ animationDuration: '1.2s' }} 
                      />
                    </div>
                  </div>

                  {/* Authentic sub-level motherboard connection bars */}
                  <div className="flex gap-[1.5px] items-center justify-center h-1 w-full opacity-70 z-10">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                    <span className="w-4 h-[1px] bg-zinc-700" />
                    <span className="w-1.5 h-1.5 rounded-sm bg-teal-500/85" />
                    <span className="w-4 h-[1px] bg-zinc-700" />
                    <span className="w-1 h-1 rounded-full bg-pink-500" />
                  </div>
                </div>
              </div>

              {/* HEAD SHELL: REAR BACK FACE (Golden shell with back venting) */}
              <div 
                className="absolute inset-0 rounded-[9px] p-2 flex flex-col justify-center items-center text-center transition-all duration-300"
                style={{ 
                  transform: 'rotateY(180deg) translateZ(26px)', 
                  backfaceVisibility: 'hidden',
                  background: translucentBrainShell ? 'rgba(0, 240, 255, 0.18)' : 'linear-gradient(135deg, #d97706 0%, #b45309 60%, #78350f 100%)',
                  border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1.5px solid #78350f',
                  boxShadow: 'inset -2.5px 2.5px 5px rgba(0,0,0,0.4), inset 1.5px -1.5px 3px rgba(255,255,255,0.2)'
                }}
              >
                <span className="text-[5px] font-mono font-black text-zinc-900 tracking-widest leading-none mb-1 shadow-[0_1px_0_rgba(255,255,255,0.25)]">COGNITIVE RADIAL</span>
                {/* Molded mechanical vent slots */}
                <div className="w-12 h-4 bg-[#0a0c14] rounded-[3px] border border-black/80 p-0.5 grid grid-cols-4 gap-[2.5px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                  <span className="h-full bg-rose-500/80 rounded-xs animate-pulse" />
                  <span className="h-full bg-zinc-800 rounded-xs" />
                  <span className="h-full bg-zinc-800 rounded-xs" />
                  <span className="h-full bg-cyan-400/80 rounded-xs animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
                <span className="text-[3.8px] font-mono text-amber-500/80 font-black mt-1 scale-[0.9]">AMDOX SYSTEMS v4</span>
              </div>

              {/* HEAD SHELL: LEFT SIDE FACE */}
              <div 
                className="absolute transition-all duration-300 rounded-[8px]"
                style={{
                  width: '52px', // Depth
                  height: '52px', // Height
                  left: '11px',
                  top: '0px',
                  transform: 'rotateY(-90deg) translateZ(37px)',
                  backfaceVisibility: 'hidden',
                  background: translucentBrainShell ? 'rgba(0, 240, 255, 0.22)' : 'linear-gradient(to bottom, #f59e0b 0%, #d97706 50%, #92400e 100%)',
                  border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f',
                  boxShadow: translucentBrainShell
                    ? 'inset 0 0 10px rgba(0,240,255,0.5)'
                    : 'inset 2px 2px 4px rgba(255,255,255,0.35), inset -2px -2px 4px rgba(0,0,0,0.4)'
                }}
              />

              {/* HEAD SHELL: RIGHT SIDE FACE */}
              <div 
                className="absolute transition-all duration-300 rounded-[8px]"
                style={{
                  width: '52px', // Depth
                  height: '52px', // Height
                  left: '11px',
                  top: '0px',
                  transform: 'rotateY(90deg) translateZ(37px)',
                  backfaceVisibility: 'hidden',
                  background: translucentBrainShell ? 'rgba(0, 240, 255, 0.22)' : 'linear-gradient(to bottom, #d97706 0%, #b45309 60%, #78350f 100%)',
                  border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f',
                  boxShadow: translucentBrainShell
                    ? 'inset 0 0 10px rgba(0,240,255,0.5)'
                    : 'inset 2px 2px 4px rgba(255,255,255,0.25), inset -2px -2px 4px rgba(0,0,0,0.45)'
                }}
              />

              {/* HEAD SHELL: LEFT EAR (Faithful dark circular cap button, refined into industrial latch) */}
              <div 
                className="absolute top-[13px] w-[10px] h-[26px] bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-full border border-black flex items-center justify-center cursor-pointer shadow-[2px_0_4px_rgba(0,0,0,0.4)]"
                style={{ 
                  left: '32px', // Centered in X: (74 - 10)/2
                  transform: 'rotateY(-90deg) translateZ(38.5px)',
                  backfaceVisibility: 'hidden',
                  boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.15)'
                }}
              >
                <div className="w-[3.5px] h-[3.5px] rounded-full bg-[#fbbf24] animate-ping" />
              </div>

              {/* HEAD SHELL: RIGHT EAR (Faithful dark circular cap button, refined into industrial latch) */}
              <div 
                className="absolute top-[13px] w-[10px] h-[26px] bg-gradient-to-r from-zinc-850 to-zinc-950 rounded-full border border-black flex items-center justify-center cursor-pointer shadow-[2px_0_4px_rgba(0,0,0,0.4)]"
                style={{ 
                  left: '32px', // Centered in X: (74 - 10)/2
                  transform: 'rotateY(90deg) translateZ(38.5px)',
                  backfaceVisibility: 'hidden',
                  boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.15)'
                }}
              >
                <div className="w-[3.5px] h-[3.5px] rounded-full bg-[#fbbf24] animate-ping" />
              </div>

              {/* HEAD TOP CAP LAYER */}
              <div 
                className="absolute rounded-[8px] transition-all duration-300"
                style={{ 
                  width: '74px',
                  height: '52px', // depth
                  left: '0px',
                  top: '0px',
                  transform: 'rotateX(90deg) translateZ(26px)',
                  backfaceVisibility: 'hidden',
                  background: translucentBrainShell ? 'rgba(0, 240, 255, 0.22)' : 'linear-gradient(to bottom, #ffe082 0%, #fbbf24 35%, #d97706 100%)',
                  border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f',
                  boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.45), inset -2.5px -2.5px 5px rgba(0,0,0,0.3)'
                }}
              />

              {/* HEAD BOTTOM CAP LAYER */}
              <div 
                className="absolute rounded-[8px] transition-all duration-300"
                style={{ 
                  width: '74px',
                  height: '52px', // depth
                  left: '0px',
                  top: '0px',
                  transform: 'rotateX(-90deg) translateZ(26px)',
                  backfaceVisibility: 'hidden',
                  background: translucentBrainShell ? 'rgba(0, 240, 255, 0.18)' : '#78350f',
                  border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.7)' : '1px solid #451a03',
                  boxShadow: 'inset -2.5px -2.5px 5px rgba(0,0,0,0.45)'
                }}
              />
            </div>
          </div>

          {/* === 3. FLOATING MAGNETIC LEVITATION FIELD (Replacing rigid physical neck) === */}
          <div 
            className="absolute w-[36px] h-[36px] rounded-full border-2 transition-all duration-300"
            style={{ 
              transform: 'translateY(1px) translateZ(0) rotateX(90deg) scale(0.9)',
              borderColor: translucentBrainShell ? '#22d3ee' : '#f59e0b',
              background: translucentBrainShell 
                ? 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0) 70%)'
                : 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0) 70%)',
              animation: translucentBrainShell ? 'energyRingPulse 2s ease-in-out infinite' : 'amberEnergyRingPulse 2s ease-in-out infinite',
              transformStyle: 'preserve-3d',
              pointerEvents: 'none'
            }}
          >
            {/* Inner neon plasma levitation micro core */}
            <div 
              className="absolute inset-[8px] rounded-full blur-[1px]"
              style={{
                background: translucentBrainShell ? '#22d3ee' : '#fbbf24',
                boxShadow: translucentBrainShell ? '0 0 12px #22d3ee' : '0 0 12px #fbbf24'
              }}
            />
          </div>
          
          {/* Glowing magnetic particles bridge beam */}
          <div 
            className="absolute w-[2px] h-[10px] blur-[0.5px] transition-all duration-300 animate-pulse"
            style={{
              background: translucentBrainShell 
                ? 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.85), transparent)'
                : 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.85), transparent)',
              transform: 'translateY(-10px) translateZ(0px)',
              pointerEvents: 'none'
            }}
          />

          {/* === 4. SMOOTH PEBBLE-STYLE TORSO/BODY (Sleek Golden Metallic curves) === */}
          <div 
            className="absolute"
            style={{
              width: '54px',
              height: '42px',
              transform: 'translateY(22px)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* TORSO INTERNAL SOLID FILLERS (Weighted interior core to hide seams) */}
            <div 
              className="absolute pointer-events-none"
              style={{
                width: '54px',
                height: '42px',
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* XY Plane */}
              <div 
                className="absolute inset-[1px] transition-all duration-300"
                style={{
                  background: translucentBrainShell 
                    ? 'rgba(0, 240, 255, 0.12)' 
                    : 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
                  borderRadius: '6px',
                  transform: 'translateZ(0px)'
                }}
              />
              {/* YZ Plane */}
              <div 
                className="absolute transition-all duration-300"
                style={{
                  width: '40px',
                  height: '40px',
                  left: '7px',
                  top: '1px',
                  background: translucentBrainShell 
                    ? 'rgba(0, 240, 255, 0.12)' 
                    : 'linear-gradient(to bottom, #d97706, #78350f)',
                  borderRadius: '6px',
                  transform: 'rotateY(90deg)'
                }}
              />
              {/* XZ Plane */}
              <div 
                className="absolute transition-all duration-300"
                style={{
                  width: '52px',
                  height: '40px',
                  left: '1px',
                  top: '1px',
                  background: translucentBrainShell 
                    ? 'rgba(0, 240, 255, 0.1)' 
                    : '#78350f',
                  borderRadius: '6px',
                  transform: 'rotateX(90deg)'
                }}
              />
            </div>

            {/* TORSO FRONT: Glossy curved golden body shell or translucent brain matrix! */}
            <div 
              className="absolute inset-0 rounded-[7px] p-[2.5px] flex flex-col justify-between transition-all duration-300 shadow-[0_3px_8px_rgba(0,0,0,0.3)]"
              style={{ 
                transform: 'translateZ(21px)', 
                transformStyle: 'preserve-3d', 
                backfaceVisibility: 'hidden',
                background: translucentBrainShell 
                  ? 'rgba(0, 240, 255, 0.22)' 
                  : 'linear-gradient(135deg, #ffe082 0%, #fbbf24 30%, #d97706 70%, #92400e 100%)',
                border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f',
                boxShadow: translucentBrainShell 
                  ? 'inset 0 0 14px rgba(0,240,255,0.7)' 
                  : 'inset 2.5px 2.5px 5px rgba(255,255,255,0.55), inset -2px -2px 5px rgba(0,0,0,0.4), 0 3px 6px rgba(0,0,0,0.25)'
              }}
            >
              {/* CONTINUOUSLY LEARNING BRAIN INNER CORE (Beautiful glowing high-tech structural nodes) */}
              <div className="absolute inset-1.5 flex items-center justify-center pointer-events-none">
                <div 
                  className="rounded-full flex items-center justify-center transition-all p-1 bg-[#14b8a6]/10 animate-pulse relative"
                  style={{
                    border: '1px solid rgba(0,240,255,0.65)'
                  }}
                >
                  <div 
                    className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] flex items-center justify-center relative overflow-hidden"
                  >
                    {/* Glowing spinner core */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,0.9)_0%,_transparent_60%)] z-10" />
                    <Sparkle className="w-2.5 h-2.5 text-white animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  {/* Surrounding orbit filaments */}
                  <span className="absolute -inset-[3px] rounded-full border border-teal-500/30 animate-spin" style={{ animationDuration: '8s' }} />
                </div>

                {/* Cybernetic wiring tubes */}
                <span className="absolute left-[3px] w-3 h-[1.5px] bg-[#00f0ff]/55 shadow-[0_0_2px_#00f0ff]" />
                <span className="absolute right-[3px] w-3 h-[1.5px] bg-[#00f0ff]/55 shadow-[0_0_2px_#00f0ff]" />
              </div>


            </div>

            {/* TORSO REAR: Backup cell systems */}
            <div 
              className="absolute inset-0 rounded-[7px] p-2 flex flex-col justify-between items-center transition-all duration-300"
              style={{ 
                transform: 'rotateY(180deg) translateZ(21px)', 
                backfaceVisibility: 'hidden',
                background: translucentBrainShell ? 'rgba(0, 240, 255, 0.2)' : 'linear-gradient(135deg, #d97706 0%, #b45309 60%, #78350f 100%)',
                border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f'
              }}
            >
              <span className="text-[5px] font-mono text-zinc-900 tracking-wider font-black shadow-[0_0.5px_-0.5px_rgba(255,255,255,0.15)] pb-0.5">FUSION CORE</span>
              <div className="w-full bg-black/80 rounded border border-white/5 p-0.5 mt-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                <div 
                  className="bg-[#00f0ff] h-1.5 rounded-sm transition-all duration-300" 
                  style={{ 
                    width: `${learningProgress}%`,
                    background: 'linear-gradient(to right, #14b8a6, #22c55e)'
                  }} 
                />
              </div>
              <span className="text-[4px] font-mono text-zinc-800 font-extrabold uppercase">DATABASE LINK [TRUE]</span>
            </div>

            {/* TORSO SHELL: LEFT SIDE FACE */}
            <div 
              className="absolute transition-all duration-300 rounded-[6px]"
              style={{
                width: '42px', // Depth
                height: '42px', // Height
                left: '6px',
                top: '0px',
                transform: 'rotateY(-90deg) translateZ(27px)',
                backfaceVisibility: 'hidden',
                background: translucentBrainShell ? 'rgba(0, 240, 255, 0.22)' : 'linear-gradient(to bottom, #ffe082 0%, #fbbf24 45%, #d97706 100%)',
                border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f',
                boxShadow: translucentBrainShell
                  ? 'inset 0 0 10px rgba(0,240,255,0.5)'
                  : 'inset 2px 2px 4px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(0,0,0,0.35)'
              }}
            />

            {/* TORSO SHELL: RIGHT SIDE FACE */}
            <div 
              className="absolute transition-all duration-300 rounded-[6px]"
              style={{
                width: '42px', // Depth
                height: '42px', // Height
                left: '6px',
                top: '0px',
                transform: 'rotateY(90deg) translateZ(27px)',
                backfaceVisibility: 'hidden',
                background: translucentBrainShell ? 'rgba(0, 240, 255, 0.22)' : 'linear-gradient(to bottom, #d97706 0%, #b45309 60%, #78350f 100%)',
                border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f',
                boxShadow: translucentBrainShell
                  ? 'inset 0 0 10px rgba(0,240,255,0.5)'
                  : 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.4)'
              }}
            />

            {/* TORSO SIDE: LEFT JOINT (Segmented industrial chrome arms) */}
            <div 
              className="absolute top-1 bottom-1 bg-zinc-900 rounded-full border border-black/80"
              style={{ 
                left: '6px', 
                width: '42px',
                transform: 'rotateY(-90deg) translateZ(28.5px)',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.9)'
              }}
            >
              <div 
                className="absolute top-1.5 w-3.5 h-11 origin-top flex flex-col items-center"
                style={{ 
                  left: '19px', // Balanced alignment
                  transform: `rotateZ(${isDraggingRotation ? -24 : -14}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Arm Segment 1: Polish Chrome */}
                <div 
                  className="w-2.5 h-4.5 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.35)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Hinged elbow sleeve */}
                <div className="w-[11px] h-2 bg-gradient-to-r from-zinc-800 via-zinc-900 to-black my-[1px] border-y border-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] animate-pulse" />
                {/* Arm Segment 2 */}
                <div 
                  className="w-2.5 h-4 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Wrist cuffs */}
                <div 
                  className="w-3.5 h-2 border-t border-black/30 rounded-sm"
                  style={{
                    background: 'linear-gradient(to right, #fbbf24 0%, #d97706 75%, #78350f 100%)'
                  }}
                />
                {/* Claw joint hand */}
                <div className="w-4 h-3 bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-b flex items-center justify-around px-0.5 border border-black/60">
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                </div>
              </div>
            </div>

            {/* TORSO SIDE: RIGHT JOINT */}
            <div 
              className="absolute top-1 bottom-1 bg-zinc-900 rounded-full border border-black/80"
              style={{ 
                right: '6px', 
                width: '42px',
                transform: 'rotateY(90deg) translateZ(28.5px)',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.9)'
              }}
            >
              <div 
                className="absolute top-1.5 w-3.5 h-11 origin-top flex flex-col items-center"
                style={{ 
                  left: '19px', // Balanced alignment
                  transform: `rotateZ(${isDraggingRotation ? 24 : 14}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Arm Segment 1: Polish Chrome */}
                <div 
                  className="w-2.5 h-4.5 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.35)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Hinged elbow sleeve */}
                <div className="w-[11px] h-2 bg-gradient-to-r from-zinc-800 via-zinc-900 to-black my-[1px] border-y border-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] animate-pulse" />
                {/* Arm Segment 2 */}
                <div 
                  className="w-2.5 h-4 rounded border border-black/30 relative"
                  style={{
                    background: 'linear-gradient(to right, #9ca3af 0%, #f3f4f6 30%, #d1d5db 50%, #4b5563 85%, #1f2937 100%)',
                    boxShadow: '0 1.5px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-[0.5px] bg-white/35" />
                </div>
                {/* Wrist cuffs */}
                <div 
                  className="w-3.5 h-2 border-t border-black/30 rounded-sm"
                  style={{
                    background: 'linear-gradient(to right, #fbbf24 0%, #d97706 75%, #78350f 100%)'
                  }}
                />
                {/* Claw joint hand */}
                <div className="w-4 h-3 bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-b flex items-center justify-around px-0.5 border border-black/60">
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                  <span className="w-1 h-2 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-sm" />
                </div>
              </div>
            </div>

            {/* TORSO TOP LAYER */}
            <div 
              className="absolute transition-all duration-300"
              style={{ 
                width: '54px',
                height: '42px', // depth
                left: '0px',
                top: '0px',
                transform: 'rotateX(90deg) translateZ(21px)',
                backfaceVisibility: 'hidden',
                background: translucentBrainShell ? 'rgba(0, 240, 255, 0.22)' : 'linear-gradient(to bottom, #fbbf24 0%, #d97706 100%)',
                border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.8)' : '1px solid #78350f'
              }}
            />

            {/* TORSO BOTTOM LAYER */}
            <div 
              className="absolute transition-all duration-300"
              style={{ 
                width: '54px',
                height: '42px', // depth
                left: '0px',
                top: '0px',
                transform: 'rotateX(-90deg) translateZ(21px)',
                backfaceVisibility: 'hidden',
                background: translucentBrainShell ? 'rgba(0, 240, 255, 0.18)' : '#78350f',
                border: translucentBrainShell ? '1.5px solid rgba(0, 240, 255, 0.7)' : '1px solid #451a03'
              }}
            />
          </div>

          {/* === 5. LOWER ENGINE THRUSTER / HOVER CONE (Jet-Burned Titanium Nozzle & Plasma Shock diamonds) === */}
          <div 
            className="absolute flex flex-col items-center animate-bounce duration-[0.5s]" 
            style={{ 
              transform: 'translateY(51px) translateZ(0px)',
              transformStyle: 'preserve-3d',
              animationDuration: '0.6s'
            }}
          >
            {/* Machined jet-burned titanium alloy nozzle */}
            <div 
              className="w-6 h-2.5 rounded-b-[4px] border-t border-black/80 relative shadow-[0_3px_5px_rgba(0,0,0,0.5)]" 
              style={{
                background: 'linear-gradient(to right, #413d4c 0%, #2f2a36 30%, #564f63 50%, #1e1b24 85%, #342f3d 100%)',
              }}
            >
              {/* Heat-discoloration ring near lip (metallic blue & deep violet anodizing) */}
              <div className="absolute bottom-[0.5px] inset-x-0 h-[1.2px] bg-gradient-to-r from-blue-500/40 via-purple-600/50 to-orange-400/20 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-[2px] w-[0.5px] bg-white/10 pointer-events-none" />
            </div>

            {/* High-fidelity responsive plasma jet flame */}
            <div 
              className="w-4 h-6 rounded-b-full flex flex-col items-center justify-start mt-0.5 relative"
              style={{
                background: translucentBrainShell
                  ? 'radial-gradient(ellipse at top, rgba(34, 211, 238, 0.9) 0%, rgba(6, 182, 212, 0.45) 45%, transparent 100%)'
                  : 'radial-gradient(ellipse at top, rgba(254, 215, 170, 0.95) 0%, rgba(249, 115, 22, 0.6) 40%, rgba(239, 68, 68, 0.1) 80%, transparent 100%)',
                boxShadow: translucentBrainShell
                  ? '0 6px 12px rgba(6, 182, 212, 0.6)'
                  : '0 6px 12px rgba(249, 115, 22, 0.55), 0 0 4px rgba(239, 68, 68, 0.35)'
              }}
            />
          </div>

        </div>
      </div>

      {/* Floating Interactive Particles */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 70, scale: 0.6 }}
            animate={{ 
              opacity: [0, 0.9, 0.9, 0], 
              y: [70, -60], 
              scale: [0.6, 1.2, 0.8] 
            }}
            transition={{ 
              duration: 2.2, 
              delay: p.delay,
              ease: "easeOut"
            }}
            className="absolute text-xs"
            style={{ left: `${p.left}%` }}
          >
            {p.char}
          </motion.div>
        ))}
      </div>

      {/* Dynamic Speech Emote Bubble */}
      {showEmoteBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className={`absolute -top-11 left-1/2 -translate-x-1/2 w-[180px] p-2 rounded-xl border text-[9.5px] font-mono text-center font-bold tracking-wide leading-tight z-50 pointer-events-auto cursor-pointer ${
            emote === 'happy'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/45 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
              : emote === 'love'
              ? 'bg-pink-950/90 text-pink-300 border-pink-500/45 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
              : emote === 'shock'
              ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/45 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
              : emote === 'angry'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/45 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
              : 'bg-zinc-900/95 text-amber-300 border-amber-500/35 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
          }`}
          onClick={() => setShowEmoteBubble(false)}
        >
          {emote === 'happy' && "Hehe, having a great day! 😊✨"}
          {emote === 'love' && "You are doing amazing! 🥰💖"}
          {emote === 'shock' && "BEEP! Heavy forecast deficit! 😲⚡"}
          {emote === 'angry' && "Warning: Budget overruns! 😤🔥"}
          {emote === 'normal' && "Systems optimized & ready! 🤖💼"}
          {/* Bubble tail arrow */}
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b" 
            style={{ 
              borderColor: emote === 'happy' ? '#10b981' : emote === 'love' ? '#f43f5e' : emote === 'shock' ? '#06b6d4' : emote === 'angry' ? '#ef4444' : '#f59e0b',
              backgroundColor: emote === 'happy' ? '#064e3b' : emote === 'love' ? '#4c0519' : emote === 'shock' ? '#083344' : emote === 'angry' ? '#4c0519' : '#18181b'
            }} 
          />
        </motion.div>
      )}


    </motion.div>
  );
}
