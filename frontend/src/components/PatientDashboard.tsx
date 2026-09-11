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

export const PatientDashboard: React.FC = () => {
  const { recoveryPlan, patientAlerts, toggleTaskCompletion, resolveAlert, submitReview } =
    useRecovery('patient');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const completedTasksCount =
    recoveryPlan?.tasks?.filter((t: any) => t.completed).length || 1;
  const totalTasksCount = recoveryPlan?.tasks?.length || 4;

  const handleToggleTask = (taskId: string) => {
    toggleTaskCompletion.mutate({ taskId });
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400">Good morning, Maya</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Your recovery today
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay close to the next small step. Your care team is following along.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start bg-slate-100/80 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Demo patient workspace</span>
        </div>
      </div>

      {/* 4 Metric Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Plan progress</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">12/28 days</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Post-operative knee recovery</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Today&apos;s tasks</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {completedTasksCount}/{totalTasksCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Daily recovery schedule</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Next review</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">6:00 PM</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Daily recovery check-in</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Care team</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">Dr. Rao</div>
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
                Post-operative knee recovery
              </h3>
            </div>
            <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
              View full plan
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${recoveryPlan?.progress_pct || 43}%` }}
            />
          </div>

          {/* Task Checklist Items */}
          <div className="divide-y divide-slate-100 pt-1">
            {recoveryPlan?.tasks?.map((task: any) => {
              const isChecked = task.completed;
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <button
                      type="button"
                      className="text-slate-300 group-hover:text-slate-400 focus:outline-hidden transition-colors"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div
                        className={`text-xs font-semibold ${
                          isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {task.category} · {task.schedule_times?.[0] || '8:00 AM'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Care Alerts (col-span-4) */}
        <div className="lg:col-span-4">
          <AlertsDrawer
            role="patient"
            alerts={patientAlerts}
            onResolveAlert={(id) => resolveAlert.mutate(id)}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        </div>
      </div>

      {/* Activity Calendar Section */}
      <ActivityCalendar patientName="Maya Patel" />

      {/* Tremor Recovery Analytics Chart */}
      <RecoveryChart />

      {/* Daily Review Modal Dialog */}
      <DailyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={(data) => submitReview.mutate(data)}
      />
    </div>
  );
};
