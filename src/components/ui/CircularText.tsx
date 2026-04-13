import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface CircularTextProps {
  text: string;
  radius?: number;
  letterSpacingDeg?: number;
  scrollRange?: number;
  className?: string;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  radius = 70,
  letterSpacingDeg = 2,
  scrollRange = 1200,
  className = '',
}) => {
  const letters = Array.from(text);
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, scrollRange], [0, 360]);
  const smoothRotate = useSpring(rotate, { stiffness: 140, damping: 20 });

  return (
    <motion.div
      className={`m-0 mx-auto rounded-full w-[200px] h-[200px] relative font-semibold text-muted-foreground text-center origin-center ${className}`}
      style={{ rotate: smoothRotate }}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i + i * letterSpacingDeg;
        const transform = `rotateZ(${rotationDeg}deg) translateY(-${radius}px)`;
        return (
          <span
            key={i}
            className="absolute inline-block inset-0 text-xs uppercase transition-transform duration-300 ease-linear"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
