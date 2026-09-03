"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Close, Search } from "relume-icons";
import { SEARCH_TYPE_LABEL, type SearchResult } from "@/lib/search-types";

const DEBOUNCE_MS = 250;

export function SearchToggle() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- classic client-only-mount guard; "has document.body become available" isn't derivable from render, it's an external-environment fact
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- paired with focusing the (not-yet-mounted-until-now) input, an imperative DOM action that has to run as an effect regardless
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- unsticking loading when a pending debounce gets cancelled by clearing the input, not derivable from render
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch((err) => {
          if ((err as Error).name !== "AbortError") throw err;
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          router.push(results[activeIndex].href);
          setOpen(false);
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, results, activeIndex, query, router]);

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-button hover:bg-white-10"
      >
        <Search className="size-5 text-scheme-text" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-1000 bg-neutral-darkest/60 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />
                <div
                  className="fixed inset-0 z-9999 flex justify-center px-[5%] pt-[12vh]"
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="h-fit w-full max-w-xl overflow-hidden rounded-card bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 border-b border-neutral-lighter px-5 py-4">
                      <Search className="size-5 shrink-0 text-neutral" />
                      <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setActiveIndex(-1);
                        }}
                        placeholder="Search news, projects, opportunities, publications..."
                        className="w-full bg-transparent text-medium text-neutral-darkest placeholder:text-neutral focus-visible:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Close search"
                        onClick={() => setOpen(false)}
                        className="flex size-8 shrink-0 items-center justify-center rounded-button text-neutral hover:bg-neutral-lightest"
                      >
                        <Close className="size-4" />
                      </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                      {!query.trim() ? (
                        <p className="px-5 py-8 text-center text-small text-neutral">
                          Start typing to search news, events, projects,
                          opportunities, and publications.
                        </p>
                      ) : loading ? (
                        <p className="px-5 py-8 text-center text-small text-neutral">
                          Searching...
                        </p>
                      ) : results.length === 0 ? (
                        <p className="px-5 py-8 text-center text-small text-neutral">
                          No results found for &quot;{query.trim()}&quot;.
                        </p>
                      ) : (
                        <div className="flex flex-col py-2">
                          {results.map((item, i) => (
                            <Link
                              key={`${item.type}-${item.href}`}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              onMouseEnter={() => setActiveIndex(i)}
                              className={`flex flex-col gap-1 px-5 py-2.5 text-left transition-colors ${
                                activeIndex === i ? "bg-neutral-lightest" : ""
                              }`}
                            >
                              <span className="w-fit rounded-badge bg-mountain-meadow-lightest px-2 py-0.5 text-tiny font-semibold text-mountain-meadow-darker">
                                {SEARCH_TYPE_LABEL[item.type]}
                              </span>
                              <p className="font-semibold text-neutral-darkest">
                                {item.title}
                              </p>
                              {item.excerpt && (
                                <p className="truncate text-small text-neutral">
                                  {item.excerpt}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {query.trim() && results.length > 0 && (
                      <Link
                        href={`/search?q=${encodeURIComponent(query.trim())}`}
                        onClick={() => setOpen(false)}
                        className="block border-t border-neutral-lighter px-5 py-3 text-center text-small font-semibold text-mountain-meadow-dark hover:bg-neutral-lightest"
                      >
                        View all results →
                      </Link>
                    )}
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
