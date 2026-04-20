export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center w-full">
      <div className="w-full max-w-md bg-[var(--background)] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  )
}
