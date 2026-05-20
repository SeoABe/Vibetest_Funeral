import FuneralForm from "@/components/admin/FuneralForm"

export default function CreatePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        새 부고 작성
      </h1>
      <FuneralForm />
    </div>
  )
}
