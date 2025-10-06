export default function Card({ title, value, children }) {
  return (
    <div className="p-4 shadow-sm card">
      {title && <div className="text-sm mb-1" style={{opacity:.75}}>{title}</div>}
      {value && <div className="text-2xl font-semibold mb-2">{value}</div>}
      {children}
    </div>
  )
}


