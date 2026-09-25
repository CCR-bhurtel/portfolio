"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/learn/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <main className="relative grid min-h-[calc(100dvh-60px)] place-items-center overflow-clip bg-ink px-6 py-16 text-paper">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-6 select-none text-[clamp(200px,34vw,460px)] font-medium leading-none tracking-[-.06em] text-paper/[.04]"
      >
        Learn
      </span>
      <form action={action} className="relative w-full max-w-[420px]">
        <div className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.18em] text-ash">
          <span className="inline-block h-2 w-2 bg-accent" />
          Private
        </div>
        <h1 className="mt-5 text-[clamp(36px,5vw,56px)] font-medium leading-[.98] tracking-[-.03em]">
          This page
          <br />
          is private.
        </h1>
        <p className="mt-4 font-inter text-base leading-normal text-ash">
          Enter the password to continue.
        </p>

        <label htmlFor="learn-password" className="sr-only">
          Password
        </label>
        <input
          id="learn-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="mt-8 w-full rounded border-[1.5px] border-paper/25 bg-coal px-4 py-3.5 font-mono text-[15px] text-paper outline-none transition-colors placeholder:text-smoke focus:border-accent"
          placeholder="••••••••••••"
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-3 w-full rounded bg-accent px-6 py-[15px] font-inter text-[15px] font-medium text-paper transition-colors hover:bg-paper hover:text-ink disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Checking…" : "Unlock →"}
        </button>
        <p
          role="alert"
          className="mt-4 min-h-[1.5em] font-inter text-sm text-[#ff9b9b]"
        >
          {state.error}
        </p>
      </form>
    </main>
  );
}
