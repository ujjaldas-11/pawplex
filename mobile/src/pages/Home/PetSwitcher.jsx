import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'

export default function PetSwitcher({ pets = [], activePetId, setActivePetId }) {
  const navigate = useNavigate()

  return (
    <div className="px-5 -mt-4 mb-4">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {pets.map((pet) => {
          const isActive = pet.id === activePetId
          const emoji = pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'
          return (
            <button
              key={pet.id}
              onClick={() => setActivePetId(pet.id)}
              className={`flex flex-col items-center gap-2 px-5 py-3.5 rounded-2xl border-2 
                flex-shrink-0 hover-lift
                ${isActive
                  ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/10'
                  : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'
                }`}
            >
              <span className="text-[28px] drop-shadow-sm">{emoji}</span>
              <span className={`text-xs font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {pet.name}
              </span>
            </button>
          )
        })}

        <button
          onClick={() => navigate('/pets/add')}
          className="flex flex-col items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 
            border-dashed border-slate-200 flex-shrink-0 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-colors hover-lift"
        >
          <PlusCircle size={26} strokeWidth={1.5} />
          <span className="text-xs font-semibold tracking-wide">Add</span>
        </button>
      </div>
    </div>
  )
}