import { useState } from 'react'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden bg-white">
      {items.map((item, idx) => (
        <div key={idx}>
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div className="font-medium text-gray-800 flex items-center gap-2">
              {item.icon && <span>{item.icon}</span>}
              {item.title}
            </div>
            <span className="text-gray-500">{openIndex === idx ? '−' : '+'}</span>
          </button>
          {openIndex === idx && (
            <div className="px-4 pb-4 text-sm text-gray-700 bg-gray-50">
              {typeof item.content === 'function' ? item.content() : item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


