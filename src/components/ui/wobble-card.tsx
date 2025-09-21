import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "mx-auto w-full bg-indigo-800 relative rounded-2xl overflow-hidden",
        containerClassName
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className={cn(
          "relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden",
          className
        )}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
              "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
              "linear-gradient(225deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
              "linear-gradient(315deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};