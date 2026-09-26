"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { contactSchema } from "@/lib/contact-schema";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "peer w-full border-0 border-b border-line-strong bg-transparent px-0 pb-3 pt-6 text-base text-fg outline-none transition-colors placeholder:text-transparent focus:border-violet";
const label =
  "pointer-events-none absolute left-0 top-6 origin-left text-sm text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-violet-soft peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px]";

export function ContactForm({ email, types }: { email: string; types: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverMsg, setServerMsg] = useState("");
  const [type, setType] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    data.type = type;
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setServerMsg(
        j.error === "not_configured" || j.error === "send_failed"
          ? `L'envoi automatique n'est pas disponible pour le moment. Écris-moi directement à ${email}.`
          : (j.error ?? "Une erreur est survenue."),
      );
      setStatus("error");
    } catch {
      setServerMsg(`Connexion impossible. Écris-moi directement à ${email}.`);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-6 py-10" role="status">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet">
          <Check className="h-7 w-7" />
        </span>
        <h2 className="h-display text-3xl">Message reçu.</h2>
        <p className="text-muted">Merci ! Je te réponds en général sous 24 à 48 h.</p>
        <button type="button" onClick={() => setStatus("idle")} className="text-sm text-violet-soft hover:text-fg">
          Envoyer un autre message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby={status === "error" ? "form-error" : undefined}>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative">
          <input id="name" name="name" autoComplete="name" placeholder="Nom" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
          <label htmlFor="name" className={label}>Ton nom</label>
          {errors.name && <p id="name-err" className="mt-2 text-xs text-red-400">{errors.name}</p>}
        </div>
        <div className="relative">
          <input id="email" name="email" type="email" autoComplete="email" placeholder="Courriel" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
          <label htmlFor="email" className={label}>Ton courriel</label>
          {errors.email && <p id="email-err" className="mt-2 text-xs text-red-400">{errors.email}</p>}
        </div>
      </div>

      <fieldset>
        <legend className="mb-4 text-sm text-muted">Type de projet</legend>
        <div className="flex flex-wrap gap-2">
          {[...types, "Autre"].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(type === t ? "" : t)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors ${type === t ? "border-violet bg-violet/25 text-fg" : "border-line-strong text-muted hover:text-fg"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="relative">
        <input id="date" name="date" placeholder="Date" className={field} />
        <label htmlFor="date" className={label}>Date souhaitée (optionnel)</label>
      </div>

      <div className="relative">
        <textarea id="message" name="message" rows={5} placeholder="Message" className={`${field} resize-none`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "msg-err" : undefined} />
        <label htmlFor="message" className={label}>Parle-moi de ton projet</label>
        {errors.message && <p id="msg-err" className="mt-2 text-xs text-red-400">{errors.message}</p>}
      </div>

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <AnimatePresence>
        {status === "error" && (
          <motion.p id="form-error" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            {serverMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={status === "sending"} className="btn-ghost disabled:cursor-wait disabled:opacity-60">
        {status === "sending" ? (
          <>
            Envoi… <LoaderCircle className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Envoyer <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </>
        )}
      </button>
    </form>
  );
}
