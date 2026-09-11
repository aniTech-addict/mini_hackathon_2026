import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock, Check, Filter, Activity } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { api } from '../../lib/api';

export const FullCalendarScreen: React.FC = () => {
  const { toggleTaskCompletion, dailyReviews } = useRecovery('patient');
  const [selectedDay, setSelectedDay] = useState<number>(11);
  const [monthOffset, setMonthOffset] = useState<number>(0); // 0 = Sept 2026
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const year = 2026;
  const month = 8 + monthOffset; // 8 = September
  const currentMonthDate = new Date(Date.UTC(year, month, 1));
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
  const displayYear = currentMonthDate.getUTCFullYear();

  // Month calculations
  const numDaysInMonth = new Date(Date.UTC(displayYear, month + 1, 0)).getUTCDate();
  const firstDayOfWeek = new Date(Date.UTC(displayYear, month, 1)).getUTCDay();

  const fromDateStr = `${displayYear}-${String(month + 1).padStart(2, '0')}-01`;
  const toDateStr = `${displayYear}-${String(month + 1).padStart(2, '0')}-${String(numDaysInMonth).padStart(2, '0')}`;
  const selectedDateStr = `${displayYear}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  // Fetch range data from backend
  const { data: calendarRange } = useQuery({
    queryKey: ['patient', 'calendar', 'range', fromDateStr, toDateStr],
    queryFn: () => api.getCalendarRange(fromDateStr, toDateStr),
  });

  // Fetch selected day checklist
  const { data: dayData, isLoading: isDayLoading } = useQuery({
    queryKey: ['patient', 'calendar', 'date', selectedDateStr],
    queryFn: () => api.getCalendarByDate(selectedDateStr),
  });

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const rangeMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    if (Array.isArray(calendarRange)) {
      calendarRange.forEach((day: any) => {
        if (day?.date) map[day.date] = day;
      });
    }
    return map;
  }, [calendarRange]);

  const selectedDayReview = React.useMemo(() => {
    if (!dailyReviews || !Array.isArray(dailyReviews)) return null;
    return dailyReviews.find((r: any) => {
      const revDate = r.review_date ? r.review_date.split('T')[0] : '';
      return revDate === selectedDateStr;
    });
  }, [dailyReviews, selectedDateStr]);

  const rawTasks = dayData?.tasks || [];
  const filteredTasks = rawTasks.filter((task: any) => {
    if (categoryFilter === 'ALL') return true;
    return task.category === categoryFilter;
  });

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Protocol Schedule</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recovery Protocol Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            View prescribed recovery tasks by date, monitor completion status, and maintain adherence.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <div className="flex items-center space-x-1 text-xs text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {['ALL', 'EXERCISE', 'MEDICATION', 'WOUND_CARE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-900">{monthName} {displayYear}</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                Recovery Protocol
              </span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl">
              <button 
                type="button"
                onClick={() => setMonthOffset((prev) => prev - 1)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setMonthOffset(0); setSelectedDay(11); }}
                className="text-xs font-semibold text-slate-700 px-2 hover:text-emerald-700"
              >
                Current
              </button>
              <button 
                type="button"
                onClick={() => setMonthOffset((prev) => prev + 1)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Structured Calendar Grid Container with visible 1px borders */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-slate-200">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-px bg-slate-200 border-b border-slate-200 text-center">
              {daysOfWeek.map((d, idx) => (
                <div 
                  key={d} 
                  className={`py-2.5 text-[11px] font-bold tracking-wider ${
                    idx === 0 || idx === 6 ? 'bg-slate-100/80 text-slate-400' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid with Crisp 1px Grid Lines */}
            <div className="grid grid-cols-7 gap-px bg-slate-200">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div
                  key={`lead-${i}`}
                  className="min-h-[80px] sm:min-h-[92px] p-2 bg-slate-50/70 text-slate-300 flex flex-col justify-between select-none"
                >
                  <span className="text-xs font-medium text-slate-300">·</span>
                </div>
              ))}

              {/* Month Days */}
              {Array.from({ length: numDaysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = `${displayYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayInfo = rangeMap[dateKey];
                const dayTasks = dayInfo?.tasks || [];
                const recoveryDay = dayInfo?.recovery_day;

                let status: 'completed' | 'partial' | 'pending' | 'none' = 'none';
                if (dayTasks.length > 0) {
                  const completedCount = dayTasks.filter((t: any) => t.status === 'completed').length;
                  if (completedCount === dayTasks.length) status = 'completed';
                  else if (completedCount > 0) status = 'partial';
                  else status = 'pending';
                } else if (day <= 11 && monthOffset === 0) {
                  status = day % 4 === 0 ? 'partial' : 'completed';
                }

                const isSelected = selectedDay === day;
                const isToday = day === 11 && monthOffset === 0;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`min-h-[80px] sm:min-h-[92px] p-2 flex flex-col justify-between items-start transition-all relative text-left bg-white ${
                      isSelected
                        ? 'bg-emerald-50/90 ring-2 ring-emerald-600 ring-inset z-10'
                        : isToday
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-full flex justify-between items-center">
                      <span
                        className={`text-xs font-bold ${
                          isSelected
                            ? 'text-emerald-950 font-extrabold'
                            : isToday
                            ? 'text-emerald-700 font-bold'
                            : 'text-slate-800'
                        }`}
                      >
                        {day}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-bold uppercase bg-emerald-600 text-white px-1 py-0.5 rounded leading-none">
                          Today
                        </span>
                      )}
                      {recoveryDay && recoveryDay > 0 && !isToday && (
                        <span className="text-[9px] font-medium text-slate-400">
                          D{recoveryDay}
                        </span>
                      )}
                    </div>

                    {/* Middle: Mini activity tags */}
                    <div className="w-full space-y-0.5 my-1">
                      {status === 'completed' && (
                        <div className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded truncate">
                          ✓ All Tasks Done
                        </div>
                      )}
                      {status === 'partial' && (
                        <div className="text-[9px] font-semibold text-amber-800 bg-amber-50 px-1 py-0.5 rounded truncate">
                          ~ Tasks In Progress
                        </div>
                      )}
                      {status === 'pending' && (
                        <div className="text-[9px] font-semibold text-slate-600 bg-slate-50 px-1 py-0.5 rounded truncate">
                          · Scheduled
                        </div>
                      )}
                    </div>

                    {/* Status Indicator Pill */}
                    <div className="w-full flex justify-end">
                      {status === 'completed' && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span className="hidden sm:inline">Completed</span>
                        </span>
                      )}
                      {status === 'partial' && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="hidden sm:inline">Partial</span>
                        </span>
                      )}
                      {status === 'pending' && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-500">
                          <span>Due</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Trailing cells */}
              {Array.from({ 
                length: (7 - ((firstDayOfWeek + numDaysInMonth) % 7)) % 7 
              }).map((_, i) => (
                <div
                  key={`trail-${i}`}
                  className="min-h-[80px] sm:min-h-[92px] p-2 bg-slate-50/70 text-slate-300 flex flex-col justify-between select-none"
                >
                  <span className="text-xs font-medium text-slate-300">·</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium">All Tasks Done</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-medium">Partial Completion</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="font-medium">Upcoming / Scheduled</span>
            </div>
          </div>
        </div>

        {/* Selected Day Agenda */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {dayData?.recovery_day ? `Day ${dayData.recovery_day} Agenda` : 'Daily Agenda'}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {monthName} {selectedDay}, {displayYear}
              </h2>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {filteredTasks.length} Tasks
            </div>
          </div>

          {/* Daily Review Card if logged */}
          {selectedDayReview && (
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  Daily Review: {selectedDayReview.scale || selectedDayReview.recovery_score}/10
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Logged by Patient
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedDayReview.note || 'Recovery protocol update recorded.'}
              </p>
            </div>
          )}

          {/* Task List */}
          <div className="space-y-3">
            {isDayLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading protocol checklist...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <div className="text-xs font-semibold text-slate-600">No tasks for this date</div>
                <div className="text-[11px] mt-0.5">Check other days or adjust the category filter.</div>
              </div>
            ) : (
              filteredTasks.map((task: any) => {
                const isCompleted = task.status === 'completed' || task.completed;
                const taskId = task.task_id || task.id;

                return (
                  <div
                    key={taskId}
                    onClick={() => toggleTaskCompletion.mutate({ 
                      taskId, 
                      scheduleDate: selectedDateStr 
                    })}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {task.category}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          {Array.isArray(task.schedule_times) && task.schedule_times.length > 0 
                            ? task.schedule_times.join(', ') 
                            : 'Flexible schedule'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
