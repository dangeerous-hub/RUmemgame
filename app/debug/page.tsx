export default function DebugPage() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return (
    <main style={{ padding: 20 }}>
      <h1>Debug</h1>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      <p>Key starts with: {key.slice(0, 25)}</p>
      <p>Key contains project ref: {key.includes("gpdalwqitajjxgfcymmp") ? "YES" : "NO"}</p>
    </main>
  )
}