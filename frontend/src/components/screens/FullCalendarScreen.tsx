import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { DEMO_CALENDAR_STATUS } from '../../lib/api';

export const FullCalendarScreen: React.FC = () => {
  const { recoveryPlan, toggleTaskCompletion } = useRecovery('patient');
  const [selectedDay, setSelectedDay] = useState<number>(12);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const daysInMonth = 30; // September 2026
  const startDayOffset = 2; // Tuesday start for Sept 1, 2026
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const filteredTasks = recoveryPlan.tasks.filter((task: any) => {
    if (categoryFilter === 'ALL') return true;
    return task.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Protocol Calendar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">September 2026 Schedule</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse schedule by date, filter clinical activities, and log adherence.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {['ALL', 'EXERCISE', 'MEDICATION', 'ACTIVITY', 'CHECK_IN'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-slate-900">September 2026</span>
              <span className="text-xs text-slate-400 font-medium">(Recovery Phase 1)</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading days */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`blank-${i}`} className="h-16 rounded-xl bg-slate-50/40 border border-transparent" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = DEMO_CALENDAR_STATUS[day];
              const isSelected = selectedDay === day;
              const isToday = day === 12;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-16 p-1.5 rounded-xl border flex flex-col justify-between items-start transition-all relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : isToday
                      ? 'border-emerald-300 bg-white ring-2 ring-emerald-500/20'
                      : 'border-slate-200/70 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-full flex justify-between items-center">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-emerald-800 font-bold' : isToday ? 'text-emerald-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>

                  {/* Status Indicator Dot */}
                  <div className="w-full flex justify-end">
                    {status === 'completed' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Completed" />
                    )}
                    {status === 'partial' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Partially completed" />
                    )}
                    {!status && day <= 12 && (
                      <span className="w-2 h-2 rounded-full bg-slate-300" title="No update" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All Tasks Done</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Partial Completion</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Upcoming / Inactive</span>
            </div>
          </div>
        </div>

        {/* Selected Day Agenda */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Day {selectedDay} Agenda
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                September {selectedDay}, 2026
              </h2>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {filteredTasks.length} Tasks
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task: any) => (
              <div
                key={task.id}
                onClick={() => toggleTaskCompletion.mutate({ taskId: task.id })}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  task.completed
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{task.schedule_times?.[0] || 'Flexible schedule'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
