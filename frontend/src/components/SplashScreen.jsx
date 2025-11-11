import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/logo/dietura-logo.jpg"; // adjust path if needed

function SplashScreen({ onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onComplete(), 1000);
    }, 3000); // 3 seconds for cinematic entry
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background:
              "radial-gradient(circle at center, #064e3b 0%, #047857 40%, #065f46 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* Background floating glow orbs */}
          <motion.div
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent)",
              filter: "blur(100px)",
              top: "10%",
              left: "20%",
              zIndex: 1,
            }}
          />

          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent)",
              filter: "blur(80px)",
              bottom: "15%",
              right: "25%",
              zIndex: 1,
            }}
          />

          {/* Logo Pop Animation */}
          <motion.img
            src={logo}
            alt="Dietura Logo"
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 0, 0], opacity: 1 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            style={{
              width: "140px",
              height: "140px",
              marginBottom: "1rem",
              zIndex: 3,
              filter: "drop-shadow(0 0 20px rgba(255,255,255,0.4))",
            }}
          />

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            style={{
              fontFamily: "'Poppins', system-ui, sans-serif",
              fontSize: "5.5rem",
              fontWeight: "900",
              color: "white",
              textShadow:
                "0 0 25px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.2)",
              letterSpacing: "5px",
              zIndex: 3,
            }}
          >
            Dietura
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            style={{
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "1.8rem",
              letterSpacing: "2px",
              marginTop: "0.5rem",
              zIndex: 3,
            }}
          >
            Eat Smart • Live Healthy
          </motion.p>

          {/* Bottom glow line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "70%", opacity: 1 }}
            transition={{ delay: 1.6, duration: 1, ease: "easeInOut" }}
            style={{
              height: "3px",
              marginTop: "2rem",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
              borderRadius: "2px",
              zIndex: 3,
            }}
          />

          {/* Subtle floating particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: Math.random() * window.innerWidth - window.innerWidth / 2,
                y: Math.random() * window.innerHeight - window.innerHeight / 2,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                y: ["0%", "10%", "0%"],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random(),
              }}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.5)",
                filter: "blur(2px)",
                zIndex: 2,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
