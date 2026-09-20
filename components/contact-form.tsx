"use client";

import { useState } from "react";
import { site } from "@/lib/content";

const field =
  "block w-full rounded-none border-0 border-b-[1.5px] border-paper/30 bg-transparent py-2.5 font-inter text-base text-paper outline-none placeholder:text-smoke focus:border-accent-soft";

export default function ContactForm() {
  const [handedOff, setHandedOff] = useState(false);

  // The site has no mail backend, so the note is handed to the visitor's own
  // email client, pre-filled. To send server-side instead, replace the
  // location change below with a POST to your endpoint.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `Portfolio enquiry from ${data.get("email")}`;
    const body = `${data.get("message")}\n\nReply to: ${data.get("email")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setHandedOff(true);
  };

  if (handedOff) {
    return (
      <div role="status" className="flex items-start gap-4">
        <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-accent font-mono text-sm text-paper">
          ✓
        </span>
        <div>
          <p className="text-[19px] font-medium leading-[1.35] tracking-[-.02em]">
            Your email app has the note ready — hit send and I&rsquo;ll reply
            within a day.
          </p>
          <p className="mt-2 font-inter text-sm leading-normal text-ash">
            Nothing opened? Write to{" "}
            <a href={`mailto:${site.email}`} className="text-accent-soft underline">
              {site.email}
            </a>{" "}
            or{" "}
            <button
              type="button"
              onClick={() => setHandedOff(false)}
              className="text-accent-soft underline"
            >
              go back to the form
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-[22px]">
      <div className="font-mono text-[11px] uppercase tracking-[.16em] text-ash">
        Or send a note
      </div>
      <p className="-mt-2 font-inter text-sm leading-normal text-smoke">
        Useful to include: what you&rsquo;re building, where the model fits, and
        your timeline.
      </p>
      <label className="block">
        <span className="sr-only">Your email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          className={field}
        />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          rows={3}
          required
          placeholder="What are you building?"
          className={`${field} resize-y leading-normal`}
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center gap-2.5 justify-self-start rounded bg-accent px-6 py-3.5 font-inter text-[15px] font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
      >
        Send ↗
      </button>
    </form>
  );
}
