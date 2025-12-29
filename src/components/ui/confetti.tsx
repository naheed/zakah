import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
}

interface ConfettiProps {
  isActive?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  spread?: number;
}

export function Confetti({
  isActive = true,
  duration = 3000,
  particleCount = 50,
  colors = [
    "hsl(var(--primary))",
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-4))",
    "hsl(45, 100%, 60%)", // Gold
  ],
  spread = 200,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(isActive);

  useEffect(() => {
    if (!isActive) return;
    
    // Generate particles only once when activated
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * spread,
      y: Math.random() * -200 - 50,
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
    }));
    setParticles(newParticles);
    setIsVisible(true);

    // Clean up after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: particle.x,
                  y: 400,
                  rotate: particle.rotation,
                  scale: particle.scale,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: particle.delay,
                  ease: [0.23, 0.58, 0.32, 0.95], // Custom easing for natural fall
                }}
                className="absolute"
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: particle.color,
                    boxShadow: `0 0 6px ${particle.color}`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering confetti on mount
export function useConfetti(shouldTrigger: boolean) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (shouldTrigger) {
      setTriggered(true);
    }
    // Only run when shouldTrigger changes from false to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTrigger]);

  return triggered;
}
