import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Record an admin action. Best-effort: never throws into the calling action —
 * an audit failure must not break the underlying create/update/delete.
 *
 * @param {Object}  entry
 * @param {string}  entry.action    CREATE | UPDATE | DELETE | STATUS_UPDATE
 * @param {string}  entry.entity    Order | Product | Category
 * @param {string|number} entry.entityId
 * @param {string} [entry.summary]  human-readable one-liner
 * @param {Object} [entry.changes]  { field: { from, to }, ... }
 */
export async function logAudit({ action, entity, entityId, summary, changes }) {
  try {
    const session = await auth();
    const u = session?.user;
    await prisma.auditLog.create({
      data: {
        actorId: u?.id || null,
        actorName: u?.name || null,
        actorEmail: u?.email || null,
        action,
        entity,
        entityId: String(entityId),
        summary: summary || null,
        changes: changes ?? undefined,
      },
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}

/**
 * Build a field-level diff between two plain objects.
 * Returns { field: { from, to } } for changed fields, or null if nothing changed.
 */
export function diff(before, after, fields) {
  const changes = {};
  for (const f of fields) {
    const b = before?.[f] ?? null;
    const a = after?.[f] ?? null;
    if (b !== a) changes[f] = { from: b, to: a };
  }
  return Object.keys(changes).length ? changes : null;
}
