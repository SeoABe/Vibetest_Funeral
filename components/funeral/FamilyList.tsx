interface FamilyMember {
  relation: string
  name: string
}

interface Props {
  chiefMourner: string
  familyList: FamilyMember[]
}

export default function FamilyList({ chiefMourner, familyList }: Props) {
  const members = familyList.filter((m) => m.name)
  if (members.length === 0) return null

  return (
    <section id="family" className="px-5 py-6" style={{ borderTop: "1px solid var(--border)" }}>
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
      >
        상주
      </h2>
      <ul className="flex flex-col gap-2">
        {members.map((m, i) => (
          <li key={i} className="flex items-center gap-3">
            <span
              className="text-sm w-16 shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              {m.relation}
            </span>
            <span
              className="text-base font-medium"
              style={{ color: m.name === chiefMourner ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {m.name}
              {m.name === chiefMourner && (
                <span className="ml-1.5 text-xs" style={{ color: "var(--accent)" }}>대표</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
