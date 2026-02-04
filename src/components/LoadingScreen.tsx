import { motion } from "framer-motion";
import casablueLogo from "@/assets/casablue-logo-new.png";

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <img
            src={casablueLogo}
            alt="Casablue"
            className="relative w-28 h-28 object-contain drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))' }}
          />
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.div
        className="mt-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Casablue</h1>
        <p className="text-sm text-muted-foreground mt-1">Bourse de Casablanca</p>
      </motion.div>

      {/* Loading Indicator */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-primary rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="mt-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        جاري التحميل...
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
