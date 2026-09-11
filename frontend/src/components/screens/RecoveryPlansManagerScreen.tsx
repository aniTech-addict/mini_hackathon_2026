import React, { useState } from 'react';
import { HeartPulse, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { api, DEMO_TASKS } from '../../lib/api';

export const RecoveryPlansManagerScreen: React.FC = () => {
  const { approvePlan, cancelPlan } = useRecovery('doctor');
  const [plans, setPlans] = useState([
    {
      id: 'plan-1',
      patient_name: 'Maya Patel',
      title: 'Post-operative knee recovery',
      status: 'active',
      start_date: '2026-08-30',
      total_days: 28,
      tasks: DEMO_TASKS,
    },
    {
      id: 'plan-draft-2',
      patient_name: 'Arjun Mehta',
      title: 'Lumbar Microdiscectomy Rehabilitation Protocol (AI Generated)',
      status: 'draft',
      start_date: '2026-09-12',
      total_days: 42,
      tasks: [
        { id: 't-d1', title: 'Gentle nerve gliding exercises', category: 'EXERCISE', completed: false, schedule_times: ['09:00 AM'] },
        { id: 't-d2', title: 'Avoid spinal flexion or heavy lifting', category: 'ACTIVITY', completed: false, schedule_times: ['Continuous'] },
      ],
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleApprove = async (planId: string) => {
    await approvePlan.mutateAsync(planId);
    setPlans(plans.map((p) => (p.id === planId ? { ...p, status: 'active' } : p)));
  };

  const handleCancel = async (planId: string) => {
    await cancelPlan.mutateAsync(planId);
    setPlans(plans.map((p) => (p.id === planId ? { ...p, status: 'cancelled' } : p)));
  };

  const handleGenerateAiPlan = async () => {
    setIsGenerating(true);
    try {
      const generated = await api.generateRecoveryPlan('p-3', { procedure: 'Rotator Cuff Arthroscopy' });
      const newPlan = {
        id: generated.id || `plan-draft-${Date.now()}`,
        patient_name: 'Sara Khan',
        title: 'Shoulder Arthroscopy Mobility Protocol (AI Generated)',
        status: 'draft',
        start_date: '2026-09-15',
        total_days: 35,
        tasks: [
          { id: 't-s1', title: 'Pendulum exercises with arm dangling', category: 'EXERCISE', completed: false, schedule_times: ['10:00 AM'] },
          { id: 't-s2', title: 'Wear abduction sling during sleep', category: 'ACTIVITY', completed: false, schedule_times: ['Night'] },
        ],
      };
      setPlans([newPlan, ...plans]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Clinical Protocols & AI Calibration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recovery Plans Manager</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review draft rehabilitation protocols, approve AI-generated task regimens, and govern clinical care plans.
          </p>
        </div>

        <button
          onClick={handleGenerateAiPlan}
          disabled={isGenerating}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing with LLM...' : 'Generate AI Recovery Plan'}</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {plans.map((plan) => {
          const isDraft = plan.status === 'draft';
          const isActive = plan.status === 'active';

          return (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-slate-900">{plan.title}</h2>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDraft
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Assigned Patient: <strong className="text-slate-700">{plan.patient_name}</strong> &bull; Starts {plan.start_date} &bull; Duration: {plan.total_days} Days
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isDraft && (
                    <>
                      <button
                        onClick={() => handleApprove(plan.id)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Protocol</span>
                      </button>
                      <button
                        onClick={() => handleCancel(plan.id)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  {isActive && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      Active In Clinic
                    </span>
                  )}
                </div>
              </div>

              {/* Tasks Sublist */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Prescribed Daily Tasks ({plan.tasks.length})</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {plan.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{task.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {task.category} &bull; {task.schedule_times?.[0] || 'Daily'}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
