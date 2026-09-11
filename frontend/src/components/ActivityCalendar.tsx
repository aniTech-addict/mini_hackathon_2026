import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Clock, Calendar as CalendarIcon, Check, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { useRecovery } from '../hooks/use-recovery';

interface ActivityCalendarProps {
  patientName?: string;
  onSelectDate?: (date: string) => void;
  tasks?: any[];
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  patientName = 'Maya Patel',
  onSelectDate,
  tasks: propTasks,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(11);
  const [monthOffset, setMonthOffset] = useState<number>(0); // 0 = Sept 2026
  const { toggleTaskCompletion, dailyReviews } = useRecovery('patient');

  const year = 2026;
  const month = 8 + monthOffset; // 8 = September (0-indexed)
  const currentMonthDate = new Date(Date.UTC(year, month, 1));
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
  const displayYear = currentMonthDate.getUTCFullYear();

  // Days in month
  const numDaysInMonth = new Date(Date.UTC(displayYear, month + 1, 0)).getUTCDate();
  // First day of week (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(Date.UTC(displayYear, month, 1)).getUTCDay();

  // Format date range strings for API
  const fromDateStr = `${displayYear}-${String(month + 1).padStart(2, '0')}-01`;
  const toDateStr = `${displayYear}-${String(month + 1).padStart(2, '0')}-${String(numDaysInMonth).padStart(2, '0')}`;
  const selectedDateStr = `${displayYear}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  // Fetch range data from backend
  const { data: calendarRange } = useQuery({
    queryKey: ['patient', 'calendar', 'range', fromDateStr, toDateStr],
    queryFn: () => api.getCalendarRange(fromDateStr, toDateStr),
  });

  // Fetch selected day checklist from backend
  const { data: dayData, isLoading: isDayLoading } = useQuery({
    queryKey: ['patient', 'calendar', 'date', selectedDateStr],
    queryFn: () => api.getCalendarByDate(selectedDateStr),
  });

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Map calendar range by date string
  const rangeMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    if (Array.isArray(calendarRange)) {
      calendarRange.forEach((day: any) => {
        if (day?.date) map[day.date] = day;
      });
    }
    return map;
  }, [calendarRange]);

  // Check if daily review exists for selected day
  const selectedDayReview = React.useMemo(() => {
    if (!dailyReviews || !Array.isArray(dailyReviews)) return null;
    return dailyReviews.find((r: any) => {
      const revDate = r.review_date ? r.review_date.split('T')[0] : '';
      return revDate === selectedDateStr;
    });
  }, [dailyReviews, selectedDateStr]);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const dateStr = `${displayYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  const selectedTasks = dayData?.tasks && dayData.tasks.length > 0 
    ? dayData.tasks 
    : (propTasks && propTasks.length > 0 ? propTasks : []);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Protocol Calendar</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{patientName}&apos;s Activity Calendar</h2>
          <p className="text-xs text-slate-500 mt-0.5">Interactive daily task completions and clinical recovery tracking</p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start">
          <button 
            type="button"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            aria-label="Previous month"
            className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 px-2 min-w-[120px] text-center">
            {monthName} {displayYear}
          </span>
          <button 
            type="button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            aria-label="Next month"
            className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Left: Monthly Calendar Grid (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Structured Calendar Grid Container with visible 1px borders */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-slate-200">
            {/* Weekdays Header Row */}
            <div className="grid grid-cols-7 gap-px bg-slate-200 border-b border-slate-200 text-center">
              {daysOfWeek.map((day, idx) => (
                <div 
                  key={day} 
                  className={`text-[11px] font-bold py-2.5 tracking-wider ${
                    idx === 0 || idx === 6 ? 'text-slate-400 bg-slate-100/80' : 'text-slate-600 bg-slate-50'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Matrix with Crisp 1px Grid Lines */}
            <div className="grid grid-cols-7 gap-px bg-slate-200">
              {/* Empty Prefix Cells for month start */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className="min-h-[64px] sm:min-h-[72px] p-2 bg-slate-50/70 text-slate-300 flex flex-col justify-between select-none"
                >
                  <span className="text-xs font-medium text-slate-300">·</span>
                </div>
              ))}

              {/* Current Month Days */}
              {Array.from({ length: numDaysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = `${displayYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayInfo = rangeMap[dateKey];
                const dayTasks = dayInfo?.tasks || [];
                const recoveryDay = dayInfo?.recovery_day;

                // Determine completion status
                let status: 'completed' | 'partial' | 'pending' | 'none' = 'none';
                if (dayTasks.length > 0) {
                  const completedCount = dayTasks.filter((t: any) => t.status === 'completed').length;
                  if (completedCount === dayTasks.length) status = 'completed';
                  else if (completedCount > 0) status = 'partial';
                  else status = 'pending';
                } else if (day <= 11 && monthOffset === 0) {
                  // Fallback for seeded historical days
                  status = day % 4 === 0 ? 'partial' : 'completed';
                }

                const isSelected = day === selectedDay;
                const isToday = day === 11 && monthOffset === 0;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[64px] sm:min-h-[72px] p-2 flex flex-col justify-between items-start transition-all relative text-left bg-white ${
                      isSelected
                        ? 'bg-emerald-50/90 ring-2 ring-emerald-600 ring-inset z-10'
                        : isToday
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
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

                    {/* Status Badge / Indicator */}
                    <div className="w-full flex items-center justify-between mt-1">
                      {status === 'completed' && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span className="hidden sm:inline">Done</span>
                        </span>
                      )}
                      {status === 'partial' && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="hidden sm:inline">Part</span>
                        </span>
                      )}
                      {status === 'pending' && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span className="hidden sm:inline">Plan</span>
                        </span>
                      )}
                      {status === 'none' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Trailing cells to complete the 35 or 42 grid */}
              {Array.from({ 
                length: (7 - ((firstDayOfWeek + numDaysInMonth) % 7)) % 7 
              }).map((_, i) => (
                <div 
                  key={`trail-${i}`} 
                  className="min-h-[64px] sm:min-h-[72px] p-2 bg-slate-50/70 text-slate-300 flex flex-col justify-between select-none"
                >
                  <span className="text-xs font-medium text-slate-300">·</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-medium">All tasks completed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="font-medium">Partially complete</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="font-medium">Upcoming / Scheduled</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Day Detail Panel (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1">
                <CalendarIcon className="w-3 h-3" />
                <span>Selected Schedule</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {monthName} {selectedDay}, {displayYear}
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs">
              {dayData?.recovery_day ? `Day ${dayData.recovery_day}` : 'Protocol'}
            </div>
          </div>

          {/* Cards for day review */}
          <div className="space-y-2">
            {selectedDayReview ? (
              <div className="p-3 bg-white border border-emerald-200/80 rounded-xl flex items-start space-x-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">
                      Recovery Review: {selectedDayReview.scale || selectedDayReview.recovery_score}/10
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Logged
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {selectedDayReview.note || 'Patient submitted daily review.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center space-x-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Check-in Status</div>
                  <div className="text-[11px] text-slate-500">
                    {selectedDay === 11 ? 'Pending today’s review submission' : 'Standard clinical protocol active'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scheduled Tasks for Selected Day */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Scheduled Tasks ({selectedTasks.length})
              </div>
              <span className="text-[10px] text-slate-400">Click task to check off</span>
            </div>

            {isDayLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Loading protocol checklist...
              </div>
            ) : selectedTasks.length === 0 ? (
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No prescribed clinical tasks for this date.
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {selectedTasks.map((task: any) => {
                  const isCompleted = task.status === 'completed' || task.completed;
                  const taskId = task.task_id || task.id;

                  return (
                    <div
                      key={taskId}
                      onClick={() => toggleTaskCompletion.mutate({ 
                        taskId, 
                        scheduleDate: selectedDateStr 
                      })}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                        isCompleted
                          ? 'bg-emerald-50/70 border-emerald-200 text-slate-700'
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
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-bold leading-tight ${
                              isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                            {task.category || 'RECOVERY'}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2">
                          <Clock className="w-3 h-3" />
                          <span>
                            {Array.isArray(task.schedule_times) && task.schedule_times.length > 0 
                              ? task.schedule_times.join(', ') 
                              : 'Scheduled daily'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
