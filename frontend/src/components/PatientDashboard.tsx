import { useState } from 'react';
import {
  Activity,
  ClipboardList,
  MessageSquare,
  Stethoscope,
  CheckCircle2,
  Circle,
  ShieldCheck,
} from 'lucide-react';
import { useRecovery } from '../hooks/use-recovery';
import { ActivityCalendar } from './ActivityCalendar';
import { RecoveryChart } from './RecoveryChart';
import { AlertsDrawer } from './AlertsDrawer';
import { DailyReviewModal } from './Modals';

interface PatientDashboardProps {
  onNavigate?: (section: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { recoveryPlan, planProgress, patientAlerts, dailyReviews, toggleTaskCompletion, resolveAlert, submitReview } =
    useRecovery('patient');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const userJson = typeof window !== 'undefined' ? localStorage.getItem('meditech_user') : null;
  const storedUser = userJson ? JSON.parse(userJson) : null;
  const patientDisplayName = storedUser?.user_id || 'Patient';

  const tasksList = recoveryPlan?.tasks || [];
  const completedTasksCount = tasksList.filter((t: any) => t.completed || t.status === 'completed').length;
  const totalTasksCount = tasksList.length;

  const chartData =
    dailyReviews && dailyReviews.length > 0
      ? dailyReviews.map((r: any) => ({
          date: r.review_date
            ? new Date(r.review_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
            : 'Day',
          score: Number(r.scale || r.recovery_score || 8),
          pain: Number(r.pain_level || Math.max(1, 10 - Number(r.scale || r.recovery_score || 8))),
        }))
      : undefined;

  const handleToggleTask = (taskId: string) => {
    toggleTaskCompletion.mutate({ taskId });
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400">Welcome back, {patientDisplayName}</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Your recovery dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily clinical tasks, monitor your recovery trajectory, and stay connected with your care team.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start bg-slate-100/80 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Post-Operative Recovery Portal</span>
        </div>
      </div>

      {/* 4 Metric Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Plan progress */}
        <div
          onClick={() => onNavigate?.('current_case')}
          className="bg-white border border-slate-200/80 hover:border-emerald-600 rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Plan progress</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {recoveryPlan?.days_elapsed || 1} / {recoveryPlan?.total_days || 28} days
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {recoveryPlan?.title || 'Active Rehabilitation Plan'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Today's tasks */}
        <div
          onClick={() => onNavigate?.('recovery_calendar')}
          className="bg-white border border-slate-200/80 hover:border-emerald-600 rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Today&apos;s tasks</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {completedTasksCount}/{totalTasksCount || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Daily recovery schedule</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Next review */}
        <div
          onClick={() => setIsReviewModalOpen(true)}
          className="bg-white border border-slate-200/80 hover:border-emerald-600 rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Next review</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">6:00 PM</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Click to submit daily review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Care team */}
        <div
          onClick={() => onNavigate?.('medical_file')}
          className="bg-white border border-slate-200/80 hover:border-emerald-600 rounded-2xl p-5 shadow-xs flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Care team</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">Dr. Ananya Rao</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Orthopaedic Recovery</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recovery Plan Checklist & Care Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recovery Plan & Task Checklist (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                RECOVERY PLAN
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {recoveryPlan?.title || 'Post-operative Rehabilitation Protocol'}
              </h3>
            </div>
            <div className="text-xs font-semibold text-emerald-700">
              {recoveryPlan?.progress_pct || planProgress?.compliance_rate || 0}% complete
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${recoveryPlan?.progress_pct || planProgress?.compliance_rate || 0}%` }}
            />
          </div>

          {/* Task Checklist Items */}
          <div className="divide-y divide-slate-100 pt-1">
            {tasksList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active tasks scheduled for today.
              </div>
            ) : (
              tasksList.map((task: any) => {
                const isChecked = task.completed || task.status === 'completed';
                return (
                  <div
                    key={task.id || task.task_id}
                    onClick={() => handleToggleTask(task.id || task.task_id)}
                    className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'border-slate-300 bg-white group-hover:border-emerald-500'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-transparent" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-semibold transition-all ${
                            isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {task.schedule_times?.[0] || 'Scheduled daily'} &bull; {task.frequency || 'Daily'}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {task.category}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Care Team Alerts Drawer (col-span-4) */}
        <div className="lg:col-span-4">
          <AlertsDrawer
            role="patient"
            alerts={patientAlerts}
            onResolveAlert={(id) => resolveAlert.mutate(id)}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        </div>
      </div>

      {/* Calendar and Recovery Progress Chart (col-span-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ActivityCalendar patientName={patientDisplayName} tasks={tasksList} />
        </div>
        <div className="lg:col-span-5">
          <RecoveryChart data={chartData} />
        </div>
      </div>

      {/* Modals */}
      <DailyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={({ scale, note }) => submitReview.mutate({ scale, note })}
      />
    </div>
  );
};
