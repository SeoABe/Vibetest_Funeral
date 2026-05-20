interface Visitation {
  startsAt?: string
  endsAt?: string
  note?: string
}

interface Props {
  shroudingAt: Date | null
  visitation: Visitation | null
  processionAt: Date | null
  burialPlace: string | null
}

function fmt(d: Date | string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!d) return ""
  return new Date(d).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    ...opts,
  })
}

function fmtTime(d: Date | string | null | undefined): string {
  if (!d) return ""
  return new Date(d).toLocaleString("ko-KR", { hour: "2-digit", minute: "2-digit" })
}

interface ScheduleRowProps {
  label: string
  children: React.ReactNode
}

function ScheduleRow({ label, children }: ScheduleRowProps) {
  return (
    <div className="flex gap-4 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <span
        className="text-sm w-16 shrink-0 mt-0.5"
        style={{ color: "var(--accent)" }}
      >
        {label}
      </span>
      <div className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </div>
  )
}

export default function FuneralSchedule({ shroudingAt, visitation, processionAt, burialPlace }: Props) {
  const hasAny = shroudingAt || visitation || processionAt || burialPlace
  if (!hasAny) return null

  return (
    <section id="schedule" className="px-5 py-6" style={{ borderTop: "1px solid var(--border)" }}>
      <h2
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
      >
        장례 일정
      </h2>

      <div>
        {shroudingAt && (
          <ScheduleRow label="입관">
            {fmt(shroudingAt)}
          </ScheduleRow>
        )}

        {visitation && (visitation.startsAt || visitation.endsAt) && (
          <ScheduleRow label="빈소">
            <div>
              {visitation.startsAt && visitation.endsAt
                ? `${fmt(visitation.startsAt)} ~ ${fmtTime(visitation.endsAt)}`
                : fmt(visitation.startsAt || visitation.endsAt)}
            </div>
            {visitation.note && (
              <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                {visitation.note}
              </div>
            )}
          </ScheduleRow>
        )}

        {processionAt && (
          <ScheduleRow label="발인">
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {fmt(processionAt)}
            </span>
          </ScheduleRow>
        )}

        {burialPlace && (
          <ScheduleRow label="장지">
            {burialPlace}
          </ScheduleRow>
        )}
      </div>
    </section>
  )
}
