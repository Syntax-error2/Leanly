import { useState } from 'react';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import AddPrepModal from '../components/AddPrepModal';

export default function Prep() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prepTasks = useLiveQuery(() => db.prepTasks.toArray());

  // Auto-generation logic removed to allow manual selection

  const toggleTask = async (id, currentStatus) => {
    await db.prepTasks.update(id, { completed: !currentStatus });
  };

  if (!prepTasks) return <div className="p-6">Loading tasks...</div>;

  const completedCount = prepTasks.filter(t => t.completed).length;
  const totalCount = prepTasks.length;
  const totalMins = prepTasks.reduce((acc, t) => acc + (t.timeEstimate || 5), 0);
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-leanly-background">
      <header className="p-6 pt-10 flex flex-col mb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-leanly-text-primary active:scale-95">
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-lg">Meal Prep</span>
          </div>
          <button 
            onClick={async () => await db.prepTasks.clear()}
            className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full active:scale-95 flex items-center gap-1"
          >
            <Trash2 size={14}/> Clear All
          </button>
        </div>
        <h1 className="text-[32px] leading-tight font-bold text-leanly-text-primary mb-2">Daily Preparation</h1>
        <p className="text-leanly-text-secondary font-medium">{totalCount} tasks • ~{totalMins} min</p>
      </header>

      <div className="px-6 mb-8">
        <div className="bg-white rounded-[2rem] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-leanly-text-primary">Preparation Progress</span>
            <span className="text-sm font-bold text-leanly-primary">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-leanly-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-3 pb-6">
        {prepTasks.map((task) => (
          <div 
            key={task.id} 
            className={`flex items-center bg-white p-5 rounded-[2rem] shadow-sm mb-4 cursor-pointer active:scale-[0.98] transition-transform ${task.completed ? 'opacity-60' : ''}`}
            onClick={() => toggleTask(task.id, task.completed)}
          >
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${task.completed ? 'bg-leanly-primary border-leanly-primary' : 'border-gray-300'}`}
            >
              {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <div className="ml-4 flex-1">
              <span className={`block font-semibold leading-tight ${task.completed ? 'text-leanly-text-muted line-through' : 'text-leanly-text-primary'}`}>
                {task.text}
              </span>
              <span className={`text-xs mt-1 ${task.completed ? 'text-gray-300' : 'text-leanly-primary font-bold'}`}>
                {task.timeEstimate ? `${task.timeEstimate} min` : ''} {task.category ? `• ${task.category}` : ''}
              </span>
            </div>
          </div>
        ))}
        
        {prepTasks.length === 0 && (
          <div className="text-center mt-10 p-6 opacity-60">
            <h3 className="font-bold text-lg text-leanly-text-primary mb-2">No Prep Tasks</h3>
            <p className="text-sm font-medium text-leanly-text-secondary">Tap the + button to search and add meals you want to prep!</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-leanly-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40 hover:bg-green-600"
      >
        <Plus size={28} />
      </button>

      <AddPrepModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
