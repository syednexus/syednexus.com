"use client";

import { motion } from "framer-motion";
import { Shield, Terminal } from "lucide-react";

type Props = {
  setMode: (mode: "defender" | "lab") => void;
};

export default function NexusGateway({ setMode }: Props) {
  return (
    <main className="
      min-h-screen 
      bg-gradient-to-br 
      from-[#07111f]
      via-[#10264d]
      to-[#27134d]
      text-white
      flex
      items-center
      justify-center
      overflow-hidden
    ">

      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        className="max-w-6xl w-full px-8"
      >

        <p className="text-cyan-300 tracking-[0.4em] text-sm">
          SYED NEXUS
        </p>


        <h1 className="
        text-6xl 
        md:text-7xl
        font-bold
        mt-5
        ">
          Select Interface
        </h1>


        <p className="
        text-slate-300 
        mt-6
        text-xl
        max-w-xl
        ">
          Choose your access environment.
        </p>


        <div className="
        grid 
        md:grid-cols-2 
        gap-8 
        mt-16
        ">


          {/* DEFENDER */}

          <button

          onClick={() => setMode("defender")}

          className="
          group
          text-left
          rounded-3xl
          border
          border-cyan-400/30
          bg-white/10
          backdrop-blur-xl
          p-10
          hover:scale-[1.03]
          transition
          "

          >

          <Shield 
          size={50}
          className="
          text-cyan-300
          "
          />


          <h2 className="
          text-3xl
          mt-8
          ">
            Defender Interface
          </h2>


          <p className="
          text-slate-300
          mt-4
          ">
            SOC-style professional dashboard containing background,
            experience, skills and projects.
          </p>


          </button>




          {/* LAB */}

          <button

          onClick={() => setMode("lab")}

          className="
          text-left
          rounded-3xl
          border
          border-purple-400/30
          bg-white/10
          backdrop-blur-xl
          p-10
          hover:scale-[1.03]
          transition
          "

          >

          <Terminal
          size={50}
          className="
          text-purple-300
          "
          />


          <h2 className="
          text-3xl
          mt-8
          ">
            Nexus Lab
          </h2>


          <p className="
          text-slate-300
          mt-4
          ">
            Interactive security environment with investigations,
            challenges and technical exploration.
          </p>


          </button>


        </div>


      </motion.div>


    </main>
  );
}