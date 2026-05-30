import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n";
import { cn } from "@/lib/utils";

// ─── Step config ──────────────────────────────────────────────────────────────

type ArrowKey = "A→S" | "S→A" | "S→B" | "B→S";
type NodeKey = "A" | "S" | "B";

const STEPS: Array<{ arrows: ArrowKey[]; nodes: NodeKey[]; cleanup?: boolean }> = [
  { arrows: ["A→S"], nodes: ["A", "S"] },
  { arrows: ["S→A"], nodes: ["S", "A"] },
  { arrows: ["B→S", "S→A"], nodes: ["B", "S", "A"] },
  { arrows: ["A→S", "S→B"], nodes: ["A", "S", "B"] },
  { arrows: [], nodes: ["S"], cleanup: true },
];

const STEP_MS = 2600;

// ─── SVG sub-components ───────────────────────────────────────────────────────

// Layout constants (viewBox "0 0 580 110")
const NA = { x: 5, y: 15, w: 120, h: 80 };   // Node A
const NS = { x: 230, y: 15, w: 120, h: 80 };  // Node Server
const NB = { x: 455, y: 15, w: 120, h: 80 };  // Node B
const AY_TOP = 43;   // y for top arrows (A→S, S→B)
const AY_BOT = 67;   // y for bottom arrows (S→A, B→S)

// arrows: x1/x2 endpoints (arrowheads 8px)
const ARROW_COORDS: Record<ArrowKey, { x1: number; y: number; x2: number; dir: "right" | "left" }> = {
  "A→S": { x1: 132, y: AY_TOP, x2: 222, dir: "right" },  // tip at 230
  "S→A": { x1: 222, y: AY_BOT, x2: 133, dir: "left" },   // tip at 125
  "S→B": { x1: 357, y: AY_TOP, x2: 447, dir: "right" },  // tip at 455
  "B→S": { x1: 447, y: AY_BOT, x2: 358, dir: "left" },   // tip at 350
};

function FlowNode({
  x, y, w, h,
  label, sublabel,
  active, cleanup,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sublabel: string;
  active: boolean; cleanup?: boolean;
}) {
  const activeStroke = "#3b82f6";
  const inactiveStroke = "rgba(148,163,184,0.4)";
  const cleanupStroke = "#ef4444";
  const stroke = cleanup ? cleanupStroke : active ? activeStroke : inactiveStroke;

  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={10}
        style={{
          fill: cleanup
            ? "rgba(239,68,68,0.06)"
            : active
              ? "rgba(59,130,246,0.07)"
              : "rgba(0,0,0,0.02)",
          stroke,
          strokeWidth: active || cleanup ? 1.8 : 1,
          transition: "all 0.45s ease",
        }}
      />
      {/* Main label */}
      <text
        x={x + w / 2} y={y + h / 2 - 8}
        textAnchor="middle"
        style={{
          fontSize: "11px",
          fontWeight: 700,
          fill: cleanup ? "#ef4444" : active ? "#3b82f6" : "currentColor",
          transition: "fill 0.45s ease",
          fontFamily: "inherit",
        }}
      >
        {cleanup ? "🗑" : label}
      </text>
      <text
        x={x + w / 2} y={y + h / 2 + 10}
        textAnchor="middle"
        style={{
          fontSize: "9.5px",
          fill: "rgba(100,116,139,0.8)",
          fontFamily: "inherit",
        }}
      >
        {cleanup ? "messages deleted" : sublabel}
      </text>
    </g>
  );
}

function FlowArrow({ arrowKey, active }: { arrowKey: ArrowKey; active: boolean }) {
  const { x1, y, x2, dir } = ARROW_COORDS[arrowKey];
  const TIP_SIZE = 8;

  // arrowhead tip coordinate
  const tipX = dir === "right" ? x2 + TIP_SIZE : x2 - TIP_SIZE;
  const tipY = y;

  // arrowhead polygon
  const headPoints =
    dir === "right"
      ? `${tipX},${tipY} ${x2},${y - TIP_SIZE + 2} ${x2},${y + TIP_SIZE - 2}`
      : `${tipX},${tipY} ${x2},${y - TIP_SIZE + 2} ${x2},${y + TIP_SIZE - 2}`;

  const activeColor = "#3b82f6";
  const inactiveColor = "rgba(148,163,184,0.3)";
  const color = active ? activeColor : inactiveColor;
  const dashDir = dir === "right" ? [0, -13] : [0, 13];

  return (
    <g>
      {/* Static base line */}
      <line
        x1={x1} y1={y} x2={x2} y2={y}
        style={{
          stroke: color,
          strokeWidth: active ? 1.8 : 1.2,
          transition: "stroke 0.45s ease, stroke-width 0.45s ease",
        }}
      />
      {/* Flowing overlay — only when active */}
      <AnimatePresence>
        {active && (
          <motion.line
            key="flow"
            x1={x1} y1={y} x2={x2} y2={y}
            stroke={activeColor}
            strokeWidth={2.2}
            strokeDasharray="8 5"
            initial={{ opacity: 0, strokeDashoffset: 0 }}
            animate={{ opacity: 1, strokeDashoffset: dashDir }}
            exit={{ opacity: 0 }}
            transition={{
              strokeDashoffset: { duration: 0.75, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.25 },
            }}
          />
        )}
      </AnimatePresence>
      {/* Arrowhead */}
      <polygon
        points={headPoints}
        style={{
          fill: color,
          transition: "fill 0.45s ease",
        }}
      />
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HowItWorks({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(id);
  }, []);

  const current = STEPS[step]!;
  const activeArrows = new Set(current.arrows);
  const activeNodes = new Set(current.nodes);
  const isCleanup = !!current.cleanup;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
        onClick={onClose}
      />

      {/* Glassy card */}
      <motion.div
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <h2 className="text-sm font-semibold tracking-tight">{t.hiwTitle}</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* SVG diagram */}
        <div className="px-5 pt-4 pb-1">
          <svg
            viewBox="0 0 580 110"
            className="w-full text-foreground"
            style={{ overflow: "visible" }}
          >
            {/* Node boxes */}
            <FlowNode
              {...NA} label={t.hiwClientA} sublabel="Browser"
              active={activeNodes.has("A")} cleanup={isCleanup && activeNodes.has("A")}
            />
            <FlowNode
              {...NS} label={t.hiwServer} sublabel="Socket.io"
              active={activeNodes.has("S")} cleanup={isCleanup}
            />
            <FlowNode
              {...NB} label={t.hiwClientB} sublabel="Browser"
              active={activeNodes.has("B")} cleanup={isCleanup && activeNodes.has("B")}
            />

            {/* Arrows */}
            {(["A→S", "S→A", "S→B", "B→S"] as ArrowKey[]).map((k) => (
              <FlowArrow key={k} arrowKey={k} active={activeArrows.has(k)} />
            ))}
          </svg>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 py-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-5 bg-blue-500" : "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Step description */}
        <div className="px-6 pb-5 pt-1 min-h-[72px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs font-semibold text-foreground mb-1">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold mr-1.5">
                  {step + 1}
                </span>
                {t.hiwSteps[step]?.label}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                {t.hiwSteps[step]?.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
