import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, XCircle, Sparkles, User, RefreshCw } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { api } from '../../lib/api';

export const RecoveryPlansManagerScreen: React.FC = () => {
  const { assignedPatients, approvePlan, cancelPlan } = useRecovery('doctor');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Set default patient when assignedPatients load
  useEffect(() => {
    if (assignedPatients && assignedPatients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(assignedPatients[0].patient_id);
    }
  }, [assignedPatients, selectedPatientId]);

  // Load plans for selected patient
  const loadPlans = async (patientId: string) => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const livePlans = await api.getDoctorPatientRecoveryPlans(patientId);
      if (Array.isArray(livePlans) && livePlans.length > 0) {
        // For each plan, also fetch its tasks if missing
        const enriched = await Promise.all(
          livePlans.map(async (p: any) => {
            if (!p.tasks) {
              const tasks = await api.getPlanTasks(p.id);
              return { ...p, tasks: tasks || [] };
            }
            return p;
          })
        );
        setPlans(enriched);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      loadPlans(selectedPatientId);
    }
  }, [selectedPatientId]);

  const selectedPatient =
    assignedPatients.find((p: any) => p.patient_id === selectedPatientId) || assignedPatients[0];

  const handleApprove = async (planId: string) => {
    try {
      await approvePlan.mutateAsync(planId);
      setActionMessage('Recovery plan approved successfully and is now active!');
      setTimeout(() => setActionMessage(null), 4000);
      if (selectedPatientId) loadPlans(selectedPatientId);
    } catch (err: any) {
      setActionMessage(`Error approving plan: ${err.message || 'Unknown error'}`);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleCancel = async (planId: string) => {
    try {
      await cancelPlan.mutateAsync(planId);
      setActionMessage('Recovery plan status updated to cancelled.');
      setTimeout(() => setActionMessage(null), 4000);
      if (selectedPatientId) loadPlans(selectedPatientId);
    } catch (err: any) {
      setActionMessage(`Error cancelling plan: ${err.message || 'Unknown error'}`);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleGenerateAiPlan = async () => {
    if (!selectedPatientId) return;
    setIsGenerating(true);
    try {
      await api.generateRecoveryPlan(selectedPatientId);
      setActionMessage('New AI recovery protocol draft generated!');
      setTimeout(() => setActionMessage(null), 4000);
      await loadPlans(selectedPatientId);
    } catch (err: any) {
      setActionMessage(`Failed to generate plan: ${err.message || 'Check backend connection'}`);
      setTimeout(() => setActionMessage(null), 4000);
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
            <span>Clinical Protocols &amp; AI Calibration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recovery Plans Manager</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review draft rehabilitation protocols, approve AI-generated regimens, and govern clinical care plans.
          </p>
        </div>

        <button
          onClick={handleGenerateAiPlan}
          disabled={isGenerating || !selectedPatientId}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing with LLM...' : 'Generate AI Recovery Plan'}</span>
        </button>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            &times;
          </button>
        </div>
      )}

      {/* Patient Selector Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center space-x-2 text-xs text-slate-500 shrink-0">
          <User className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">Select Patient:</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {assignedPatients.map((p: any) => {
            const isSelected = p.patient_id === selectedPatientId;
            const name = p.name || p.username || p.user_id;
            return (
              <button
                key={p.patient_id}
                type="button"
                onClick={() => setSelectedPatientId(p.patient_id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {name} ({p.age}y)
              </button>
            );
          })}
        </div>
        <button
          onClick={() => selectedPatientId && loadPlans(selectedPatientId)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          title="Refresh plans"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Loading recovery protocols from clinical database...
          </div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <HeartPulse className="w-8 h-8 mx-auto text-slate-300" />
            <div className="text-sm font-bold text-slate-700">No Recovery Plans Found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No active or draft plans found for {selectedPatient?.name || selectedPatient?.username || 'this patient'}.
              Click &quot;Generate AI Recovery Plan&quot; to create a clinical regimen.
            </p>
          </div>
        ) : (
          plans.map((plan) => {
            const isDraft = plan.status === 'draft';
            const isActive = plan.status === 'active';
            const tasks = Array.isArray(plan.tasks) ? plan.tasks : [];

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
                      Assigned Patient: <strong className="text-slate-700">{selectedPatient?.name || selectedPatient?.username || plan.patient_name || 'Patient'}</strong> &bull; Starts {plan.start_date} {plan.end_date ? `to ${plan.end_date}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDraft && (
                      <>
                        <button
                          onClick={() => handleApprove(plan.id)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Protocol</span>
                        </button>
                        <button
                          onClick={() => handleCancel(plan.id)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
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
                  <div className="text-xs font-bold text-slate-700 mb-2">Prescribed Daily Tasks ({tasks.length})</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {tasks.map((task: any) => (
                      <div
                        key={task.task_id || task.id}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{task.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {task.category} &bull; {task.schedule_times?.[0] || 'Daily'} &bull; Days {task.start_day}–{task.end_day || 30}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {task.category}
                        </span>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="col-span-2 p-3 text-center text-slate-400 text-xs bg-slate-50 rounded-lg">
                        Standard clinical care regimen assigned.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
