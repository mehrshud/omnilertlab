"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Check, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const orderSchema = z.object({
  projectType: z.enum(["website", "fullstack", "ai", "threejs", "other"]),
  projectName: z.string().min(2, "Project name is required"),
  description: z.string().min(10, "Please provide more details").max(300),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  linkedin: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const PROJECT_TYPES = [
  { value: "website", label: "Website", emoji: "🌐" },
  { value: "fullstack", label: "Full-Stack App", emoji: "⚡" },
  { value: "ai", label: "AI / Automation", emoji: "🤖" },
  { value: "threejs", label: "3D / Three.js", emoji: "🎮" },
  { value: "other", label: "Other", emoji: "✨" },
] as const;

const BUDGETS = ["Under $1K", "$1K – $5K", "$5K – $15K", "$15K+", "Let's discuss"];
const TIMELINES = ["< 1 month", "1–3 months", "3–6 months", "6+ months", "Flexible"];

export default function Order() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      projectType: undefined,
      projectName: "",
      description: "",
      budget: "",
      timeline: "",
      name: "",
      email: "",
      linkedin: "",
    },
  });

  const projectType = watch("projectType");
  const budget = watch("budget");
  const timeline = watch("timeline");

  const nextStep = async () => {
    let fieldsToValidate: (keyof OrderFormData)[] = [];
    if (step === 0) fieldsToValidate = ["projectType"];
    if (step === 1) fieldsToValidate = ["projectName", "description", "budget", "timeline"];
    if (step === 2) fieldsToValidate = ["name", "email"];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: OrderFormData) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    color: "var(--text-primary)",
    caretColor: "var(--accent-amber)",
  };

  return (
    <section id="order" ref={ref} className="relative py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--accent-amber)" }}
          >
            / commission
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-syne), system-ui" }}
          >
            Let&apos;s build <span className="gradient-text-amber">together.</span>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Start a project commission — I&apos;ll respond within 2 hours.
          </p>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-0 mb-10 px-8"
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`progress-dot ${
                  step > i ? "completed" : step === i ? "active" : ""
                }`}
              />
              {i < 3 && (
                <div
                  className={`progress-line w-16 sm:w-24 ${step > i ? "active" : ""}`}
                />
              )}
            </div>
          ))}
        </motion.div>

        <GlassCard glow="amber" className="p-8">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--accent-green)" }}
              >
                <Check size={28} color="#fff" />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-syne), system-ui" }}
              >
                ✅ Submitted!
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Mehrshad will reply within 2 hours. Check your email for
                confirmation.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 0: Project Type */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ fontFamily: "var(--font-syne), system-ui" }}
                    >
                      Step 1 — Project Type
                    </h3>
                    <p
                      className="text-xs mb-6"
                      style={{ color: "var(--text-muted)" }}
                    >
                      What kind of project are you looking to build?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PROJECT_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setValue("projectType", t.value)}
                          className={`glass glass-hover rounded-xl p-4 text-left transition-all duration-200 ${
                            projectType === t.value
                              ? "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                              : ""
                          }`}
                        >
                          <span className="text-xl mb-1 block">{t.emoji}</span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.projectType && (
                      <p className="text-xs text-red-400 mt-2">
                        Please select a project type
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Step 1: Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ fontFamily: "var(--font-syne), system-ui" }}
                    >
                      Step 2 — Details
                    </h3>
                    <div>
                      <input
                        {...register("projectName")}
                        placeholder="Project Name"
                        className="glass rounded-xl px-4 py-3 text-sm outline-none w-full transition-all duration-300 focus:border-amber-500/40"
                        style={inputStyle}
                      />
                      {errors.projectName && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.projectName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <textarea
                        {...register("description")}
                        placeholder="Brief description (max 300 chars)"
                        rows={3}
                        maxLength={300}
                        className="glass rounded-xl px-4 py-3 text-sm outline-none w-full resize-none transition-all duration-300 focus:border-amber-500/40"
                        style={inputStyle}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="text-xs font-mono mb-2 block"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Budget Range
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setValue("budget", b)}
                            className="text-xs font-mono px-3 py-1.5 rounded-full transition-all"
                            style={{
                              background:
                                budget === b
                                  ? "var(--accent-amber)"
                                  : "var(--glass-bg)",
                              color: budget === b ? "#000" : "var(--text-muted)",
                              border: `1px solid ${
                                budget === b
                                  ? "var(--accent-amber)"
                                  : "var(--glass-border)"
                              }`,
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                      {errors.budget && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.budget.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="text-xs font-mono mb-2 block"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Timeline
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setValue("timeline", t)}
                            className="text-xs font-mono px-3 py-1.5 rounded-full transition-all"
                            style={{
                              background:
                                timeline === t
                                  ? "var(--accent-amber)"
                                  : "var(--glass-bg)",
                              color: timeline === t ? "#000" : "var(--text-muted)",
                              border: `1px solid ${
                                timeline === t
                                  ? "var(--accent-amber)"
                                  : "var(--glass-border)"
                              }`,
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      {errors.timeline && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.timeline.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Contact */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ fontFamily: "var(--font-syne), system-ui" }}
                    >
                      Step 3 — Contact Info
                    </h3>
                    <div>
                      <input
                        {...register("name")}
                        placeholder="Your Name"
                        className="glass rounded-xl px-4 py-3 text-sm outline-none w-full transition-all duration-300 focus:border-amber-500/40"
                        style={inputStyle}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Email Address"
                        className="glass rounded-xl px-4 py-3 text-sm outline-none w-full transition-all duration-300 focus:border-amber-500/40"
                        style={inputStyle}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        {...register("linkedin")}
                        placeholder="LinkedIn / Portfolio URL (optional)"
                        className="glass rounded-xl px-4 py-3 text-sm outline-none w-full transition-all duration-300 focus:border-amber-500/40"
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <h3
                      className="text-lg font-bold mb-3"
                      style={{ fontFamily: "var(--font-syne), system-ui" }}
                    >
                      Step 4 — Confirm & Submit
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                      Review your details and hit submit. I&apos;ll be in
                      touch within 2 hours.
                    </p>

                    <div className="glass rounded-xl p-4 text-left mb-6">
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>
                            Type:
                          </span>
                          <span
                            className="ml-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {projectType}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>
                            Budget:
                          </span>
                          <span
                            className="ml-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {budget}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>
                            Timeline:
                          </span>
                          <span
                            className="ml-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {timeline}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>
                            Contact:
                          </span>
                          <span
                            className="ml-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {watch("email")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full glass glass-hover transition-all"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 text-xs font-mono font-bold px-6 py-2.5 rounded-full transition-all"
                    style={{
                      background: "var(--accent-amber)",
                      color: "#000",
                    }}
                  >
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-full transition-all"
                    style={{
                      background:
                        status === "submitting"
                          ? "var(--glass-bg)"
                          : "linear-gradient(135deg, var(--accent-amber), #fb923c)",
                      color: status === "submitting" ? "var(--text-muted)" : "#000",
                    }}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Submitting...
                      </>
                    ) : status === "error" ? (
                      <>
                        <Send size={14} /> Retry
                      </>
                    ) : (
                      <>
                        <Send size={14} /> Submit Commission
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
