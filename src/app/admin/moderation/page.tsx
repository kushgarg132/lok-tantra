import ModerationQueue from "@/components/admin/ModerationQueue";
import AuditLogViewer from "@/components/admin/AuditLog";

export const metadata = { title: "Moderation — LokTantra Admin" };

export default function ModerationPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Content Moderation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review flagged content and ensure LokTantra remains accurate, neutral, and trustworthy.
          </p>
        </div>

        <section>
          <h2 className="text-base font-semibold text-slate-300 mb-4">Flag Queue</h2>
          <ModerationQueue />
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-300 mb-4">Audit Log</h2>
          <AuditLogViewer />
        </section>
      </div>
    </main>
  );
}
