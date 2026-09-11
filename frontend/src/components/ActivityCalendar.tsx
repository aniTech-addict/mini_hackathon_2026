import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { DEMO_CALENDAR_STATUS } from '../lib/api';

interface ActivityCalendarProps {
  patientName?: string;
  onSelectDate?: (date: string) => void;
  tasks?: any[];
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  patientName = 'Maya Patel',
  onSelectDate,
  tasks,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(11);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // September 2026 starts on a Tuesday (day index 2)
  const emptyPrefix = [null, null];
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    if (onSelectDate) {
      const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
      onSelectDate(dateStr);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Recovery Tracking</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{patientName}&apos;s activity calendar</h2>
          <p className="text-xs text-slate-500 mt-0.5">Task completions and daily recovery reviews</p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start">
          <button className="text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-800 px-2">September 2026</span>
          <button className="text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Left: Monthly Calendar (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-7 text-center mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-[11px] font-semibold text-slate-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {emptyPrefix.map((_, idx) => (
                <div key={`empty-${idx}`} className="h-12" />
              ))}

              {daysInMonth.map((day) => {
                const status = DEMO_CALENDAR_STATUS[day] || 'no_update';
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`h-12 rounded-xl flex flex-col items-center justify-center relative transition-all border ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-950 font-bold' : 'text-slate-700'}`}>
                      {day}
                    </span>

                    {/* Status Dot Indicator */}
                    <span className="mt-1">
                      {status === 'completed' && (
                        <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                      {status === 'partial' && (
                        <span className="block w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                      {status === 'no_update' && day <= 11 && (
                        <span className="block w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-5 pt-6 text-[11px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Tasks completed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Partially complete</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              <span>No update</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Day Detail Panel (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Day</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              Friday, Sep {selectedDay}
            </div>
          </div>

          {/* Cards for day summary */}
          <div className="space-y-2.5">
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Tasks completed</div>
                <div className="text-[11px] text-slate-500">Daily scheduled activities</div>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Recovery review: 8/10</div>
                <div className="text-[11px] text-slate-500">Patient update received</div>
              </div>
            </div>
          </div>

          {/* Scheduled Tasks for Day */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Scheduled Tasks ({tasks && tasks.length > 0 ? tasks.length : 3})
            </div>
            <div className="space-y-2 text-xs">
              {tasks && tasks.length > 0 ? (
                tasks.map((task: any) => (
                  <div
                    key={task.id || task.task_id}
                    className="p-2.5 bg-white border border-slate-200/60 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 text-slate-700">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          task.completed || task.status === 'completed'
                            ? 'text-emerald-600'
                            : 'text-slate-300'
                        }`}
                      />
                      <span
                        className={
                          task.completed || task.status === 'completed'
                            ? 'line-through text-slate-400'
                            : 'font-medium text-slate-700'
                        }
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center text-slate-400 text-[11px]">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{task.schedule_times?.[0] || 'Daily'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-2.5 bg-white border border-slate-200/60 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Complete knee mobility exercises</span>
                    </div>
                    <div className="flex items-center text-slate-400 text-[11px]">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>8:00 AM</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200/60 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Take prescribed medication</span>
                    </div>
                    <div className="flex items-center text-slate-400 text-[11px]">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>1:00 PM</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200/60 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Walk for 15 minutes</span>
                    </div>
                    <div className="flex items-center text-slate-400 text-[11px]">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>5:00 PM</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
