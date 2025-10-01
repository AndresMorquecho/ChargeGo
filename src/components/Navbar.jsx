export default function Navbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="md:hidden font-semibold">ChargeGO</div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">Perfil</button>
      </div>
    </header>
  )
}


