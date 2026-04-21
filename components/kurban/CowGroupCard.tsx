"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, MessageCircle, ChevronDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type CowSlot = { name?: string };

type CowGroup = {
  id: string | number;
  name: string;
  pricePerPerson: number;
  totalSlots: number;
  filledSlots: CowSlot[];
  isLocked?: boolean;
  isFull?: boolean;
};

export default function CowGroupCard({
  group,
  index,
  onRegister,
}: {
  group: CowGroup;
  index: number;
  onRegister: (groupName: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(!group.isFull);

  const remaining = group.totalSlots - group.filledSlots.length;
  const percentFilled = (group.filledSlots.length / group.totalSlots) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "bg-white rounded-2xl border-2 flex flex-col overflow-hidden transition-colors duration-300",
        group.isFull
          ? "border-slate-200 opacity-75"
          : "border-indigo-200 ring-4 ring-indigo-50 shadow-xl shadow-indigo-100/50"
      )}
    >
      {/* ── HEADER — Reorganized to prevent truncation ── */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center gap-4 focus:outline-none group"
      >
        {/* Status Icon */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
          group.isFull
            ? "bg-slate-50 text-slate-400 border border-slate-100"
            : "bg-indigo-600 text-white shadow-indigo-100"
        )}>
          {group.isFull
            ? <CheckCircle2 className="w-5 h-5" />
            : <Users className="w-5 h-5" />
          }
        </div>

        {/* Name Area */}
        <div className="flex-1 min-w-0 flex flex-col text-left justify-center">
          <h3 className="font-bold text-base text-indigo-950 leading-tight">
            {group.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 font-bold">
            <span className={cn(
              "text-[10px] px-2.5 py-0.5 rounded-md tracking-tight uppercase",
              group.isFull
                ? "bg-amber-100/80 text-amber-800"
                : "bg-indigo-100 text-indigo-700"
            )}>
              {group.isFull ? "Penuh" : `Sisa ${remaining} Slot`}
            </span>
          </div>
        </div>

        {/* Chevron Indicator */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      {/* Progress & Quick Info area ── Always visible */}
      <div className="px-3 pb-5">
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={cn(
              "h-1.5 rounded-full transition-all duration-700",
              group.isFull ? "bg-amber-400" : "bg-indigo-500"
            )}
            style={{ width: `${percentFilled}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Rp {(group.pricePerPerson / 1000000).toFixed(2)} jt / orang
          </span>
          <span className="text-[10px] text-indigo-950/40 font-bold">
            {group.filledSlots.length} / {group.totalSlots} Terisi
          </span>
        </div>
      </div>

      {/* ── COLLAPSIBLE BODY ── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-4 space-y-2 border-t border-slate-100 pt-3">
              {Array.from({ length: group.totalSlots }).map((_, i) => {
                const person = group.filledSlots[i];
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                      person && group.isFull
                        ? "bg-amber-50/70 border border-amber-100"
                        : person
                          ? "bg-indigo-50/60 border border-indigo-100"
                          : "bg-white border border-dashed border-slate-200"
                    )}
                  >
                    {person ? (
                      <CheckCircle2 className={cn("w-4 h-4 shrink-0", group.isFull ? "text-amber-500" : "text-indigo-500")} />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm font-medium truncate",
                      person ? "text-slate-800" : "text-slate-400 italic"
                    )}>
                      {person ? person.name : "Kosong"}
                    </span>
                  </div>
                );
              })}

              {/* CTA */}
              {!group.isFull && (
                <button
                  onClick={() => onRegister(group.name)}
                  className="mt-1 w-full py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Gabung Kelompok Ini
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
