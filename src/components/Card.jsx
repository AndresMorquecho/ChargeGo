export default function Card({ title, value, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {title && <div className="text-sm text-gray-500 mb-1">{title}</div>}
      {value && <div className="text-2xl font-semibold mb-2">{value}</div>}
      {children}
    </div>
  )
}


