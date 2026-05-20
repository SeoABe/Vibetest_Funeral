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
    <section id="family" className="memorial-section px-5 py-6">
      <h2
        className="memorial-heading text-lg font-semibold mb-4"
      >
        상주
      </h2>
      <ul className="memorial-card rounded-lg px-4 py-3 flex flex-col gap-1">
        {members.map((m, i) => (
          <li key={i} className="flex items-center gap-3 py-2">
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
