import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const ENTITIES = ["ALL", "Order", "Product", "Category"];
const ACTIONS = ["ALL", "CREATE", "UPDATE", "STATUS_UPDATE", "DELETE"];

const actionTone = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  STATUS_UPDATE: "bg-indigo-100 text-indigo-700",
  DELETE: "bg-red-100 text-red-600",
};

function Chips({ label, options, active, param, searchParams }) {
  const base = new URLSearchParams(searchParams);
  base.delete("page");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-400 mr-1">{label}:</span>
      {options.map((opt) => {
        const params = new URLSearchParams(base);
        if (opt === "ALL") params.delete(param);
        else params.set(param, opt);
        const qs = params.toString();
        return (
          <Link
            key={opt}
            href={`/admin/audit${qs ? `?${qs}` : ""}`}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              active === opt
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {opt === "ALL" ? "All" : opt.replace("_", " ").toLowerCase()}
          </Link>
        );
      })}
    </div>
  );
}

function Changes({ changes }) {
  if (!changes || typeof changes !== "object") return <span className="text-gray-300">—</span>;
  const keys = Object.keys(changes);
  if (keys.length === 0) return <span className="text-gray-300">—</span>;
  return (
    <div className="space-y-0.5">
      {keys.map((k) => {
        const c = changes[k];
        const from = c?.from ?? "∅";
        const to = c?.to ?? "∅";
        return (
          <div key={k} className="text-xs text-gray-600">
            <span className="font-medium text-gray-500">{k}:</span>{" "}
            <span className="text-red-500">{String(from)}</span>
            {" → "}
            <span className="text-green-600">{String(to)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default async function AuditLogPage({ searchParams }) {
  const sp = await searchParams;
  const entity = ENTITIES.includes(sp.entity) ? sp.entity : "ALL";
  const action = ACTIONS.includes(sp.action) ? sp.action : "ALL";
  const page = Math.max(1, Number(sp.page) || 1);

  const where = {
    ...(entity === "ALL" ? {} : { entity }),
    ...(action === "ALL" ? {} : { action }),
  };

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const flatParams = { ...(entity !== "ALL" && { entity }), ...(action !== "ALL" && { action }) };
  const pageHref = (p) => {
    const params = new URLSearchParams({ ...flatParams, page: String(p) });
    return `/admin/audit?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-gray-500 mt-1">{totalCount} recorded {totalCount === 1 ? "action" : "actions"}</p>
      </div>

      <div className="space-y-3">
        <Chips label="Entity" options={ENTITIES} active={entity} param="entity" searchParams={flatParams} />
        <Chips label="Action" options={ACTIONS} active={action} param="action" searchParams={flatParams} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Admin</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Entity</th>
              <th className="px-5 py-3 font-medium">Summary</th>
              <th className="px-5 py-3 font-medium">Changes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No audit entries.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 last:border-0 align-top">
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-GB")}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-gray-900">{log.actorName || "—"}</p>
                    <p className="text-xs text-gray-400">{log.actorEmail}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${actionTone[log.action] || "bg-gray-100 text-gray-600"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{log.entity}</td>
                  <td className="px-5 py-3 text-gray-700">{log.summary || "—"}</td>
                  <td className="px-5 py-3"><Changes changes={log.changes} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                ← Prev
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-gray-100 text-gray-300">← Prev</span>
            )}
            {page < totalPages ? (
              <Link href={pageHref(page + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                Next →
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-gray-100 text-gray-300">Next →</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
