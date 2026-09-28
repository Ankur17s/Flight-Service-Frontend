import { useMemo, useState } from 'react'
import type { Airport } from '../../common/types/flight'
import { Modal } from '../common/Modal'

const airports: Airport[] = [
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji International Airport', country: 'IN' },
  { city: 'Hyderabad', code: 'HYD', name: 'Rajiv Gandhi International Airport', country: 'IN' },
  { city: 'Bangkok', code: 'BKK', name: 'Bangkok', country: 'TH' },
  { city: 'Kuala Lumpur', code: 'KUL', name: 'Kuala Lumpur International Airport', country: 'MY' },
  { city: 'Kolkata', code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', country: 'IN' },
  { city: 'New Delhi', code: 'DEL', name: 'Indira Gandhi International Airport', country: 'IN' },
]

export function AirportModal({ onClose, onSelect, title }: { onClose: () => void; onSelect: (airport: Airport) => void; title: string }) {
  const [query, setQuery] = useState('')
  const matches = useMemo(() => airports.filter((airport) => `${airport.city} ${airport.code} ${airport.name}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <Modal onClose={onClose} className="left-0 top-[calc(100%+8px)] w-[min(326px,calc(100vw-2rem))]"><div className="overflow-hidden rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-200"><label className="flex h-10 items-center gap-2 rounded-xl border border-blue-500 px-3 text-slate-500 focus-within:ring-2 focus-within:ring-blue-100"><span aria-hidden="true">⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()} city/airport`} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></label><p className="px-2 pb-2 pt-3 text-xs font-semibold text-slate-600">Popular Cities</p><div className="max-h-64 overflow-y-auto">{matches.map((airport) => <button key={airport.code} type="button" onClick={() => onSelect(airport)} className="flex w-full items-start justify-between rounded-lg px-2 py-2 text-left hover:bg-blue-50"><span><span className="block text-sm font-medium text-slate-800">{airport.city}</span><span className="block max-w-56 truncate text-xs text-slate-600">{airport.name}, {airport.country}</span></span><span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">{airport.code}</span></button>)}{matches.length === 0 && <p className="px-2 py-6 text-center text-sm text-slate-500">No airports found.</p>}</div></div></Modal>
}
