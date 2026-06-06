"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

function ConfirmButton({ confirmLabel }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
    >
      {pending ? "Deleting…" : confirmLabel}
    </button>
  );
}

/**
 * A delete trigger that opens a warning modal before submitting the server
 * action. Reusable across products, categories, and orders.
 *
 * @param {Function} action       server action (receives FormData with `id`)
 * @param {string|number} id      entity id, submitted as a hidden field
 * @param {string} [triggerLabel] text/aria for the trigger button
 * @param {string} [triggerClassName] classes for the trigger button
 * @param {React.ReactNode} [trigger] custom trigger content (overrides label)
 * @param {string} [title]        modal heading
 * @param {string} [message]      modal body warning
 * @param {string} [confirmLabel] confirm button text
 */
export default function ConfirmDeleteButton({
  action,
  id,
  triggerLabel = "Delete",
  triggerClassName = "text-red-500 hover:underline",
  trigger,
  title = "Delete this item?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
}) {
  const [open, setOpen] = useState(false);

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
        aria-haspopup="dialog"
      >
        {trigger || triggerLabel}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <form action={action}>
                <input type="hidden" name="id" value={id} />
                <ConfirmButton confirmLabel={confirmLabel} />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
