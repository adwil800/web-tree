
"use client";

import { motion } from "framer-motion";


const variants: Record<string, any> = {
    "slide-up": {
        hidden: { opacity: 0, x: 0, y: -50 },
        enter: { opacity: 1, x: 0, y: 0 },
    },
    "fade": {
        hidden: { opacity: 0 },
        enter: { opacity: 1 },
    },
    "zoom": {
        hidden: { opacity: 0, scale: 0.9 },
        enter: { opacity: 1, scale: 1 },
    },
};

export function PageTransition({ children, transitionKey, transition }: { children: React.ReactNode, transitionKey: string, transition?: 'fade' | 'slide-up' | 'zoom'}) {

    const transitionVariant = transition || 'fade';

    return (
        <motion.div 
            key={transitionKey}
            initial={"hidden"}
            animate="enter"
            variants={variants[transitionVariant]}
            transition={{ type: "linear" }}
        >
        {children}
        </motion.div>
    );
  
}

export function ItemTransition({ children, delay, component = 'div', origin }: { children: React.ReactNode, delay: number, component: 'div' | 'tr', origin: 'up' | 'down' | 'left' | 'right'}) {

  const hiddenY = origin === 'up' ? -50 : origin === 'down' ? 50 : 0;
  const hiddenX = origin === 'left' ? -50 : origin === 'right' ? 50 : 0;
  
  const MotionComponent = motion.create(component);
  
  return (
    <MotionComponent
        initial={"hidden"}
        animate={"enter"}
        variants={{
            hidden: { opacity: 0, x: hiddenX, y: hiddenY},
            enter: { opacity: 1, x: 0, y: 0, transition: { delay: delay * 0.15 }},
        }}
        transition={{ type: "linear" }}
        className="overflow-hidden"
    >
      {children}
    </MotionComponent>
  );
}

