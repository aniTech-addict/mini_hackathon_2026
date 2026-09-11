import React from 'react';
import { Activity, Calendar, User, Clock, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const CurrentCaseScreen: React.FC = () => {
  const { recoveryPlan, patientProfile, toggleTaskCompletion } = useRecovery('patient');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Case Protocol #{recoveryPlan.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{recoveryPlan.title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Care protocol initiated on {recoveryPlan.start_date} &bull; Day {recoveryPlan.days_elapsed} of {recoveryPlan.total_days}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Compliance Rate</div>
            <div className="text-2xl font-bold text-emerald-700">{recoveryPlan.progress_pct}%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient & Surgical Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Patient & Surgical Profile</span>
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Patient Name</span>
              <span className="font-semibold text-slate-800">{patientProfile?.name || 'Maya Patel'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Age & Sex</span>
              <span className="font-semibold text-slate-800">{patientProfile?.age || 29} y/o &bull; {patientProfile?.sex || 'Female'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Primary Surgeon</span>
              <span className="font-semibold text-slate-800">{patientProfile?.doctor_name || 'Dr. Ananya Rao'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Procedure Date</span>
              <span className="font-semibold text-slate-800">{patientProfile?.surgery_date || '2026-08-30'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Hospital Facility</span>
              <span className="font-semibold text-slate-800">{patientProfile?.hospital || 'St. Jude Orthopaedic Center'}</span>
            </div>
          </div>
        </div>

        {/* Phase Progression Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Recovery Milestones</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-emerald-950">Phase 1: Acute Protection</div>
                <div className="text-[11px] text-emerald-700">Days 1–14 &bull; In Progress (Day 12)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Control effusion, quad reactivation, 0° knee extension.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 opacity-80">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-800">Phase 2: Progressive Mobility</div>
                <div className="text-[11px] text-slate-500">Days 15–28 &bull; Upcoming</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Wean crutches, achieve 120° flexion, stationary bike.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Guardrails & Precautions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Clinical Guardrails</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-900">
              <span className="font-semibold">Weight Bearing:</span> Strictly partial weight-bearing with crutches until Day 14 clearance.
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-900">
              <span className="font-semibold">Brace Requirement:</span> Lock knee brace at 0° while sleeping or ambulating.
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="font-semibold">Ice Protocol:</span> Apply cryo-cuff 20 min post-exercise.
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Tasks Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Current Prescribed Protocol Tasks</h2>
            <p className="text-xs text-slate-500">Check off your assigned daily medical and physical therapy tasks</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Calibrated Protocol</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recoveryPlan.tasks.map((task: any) => (
            <div
              key={task.id}
              onClick={() => toggleTaskCompletion.mutate({ taskId: task.id })}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                task.completed
                  ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-700'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
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
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {task.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400">
                  <span className="inline-flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{task.schedule_times?.[0] || 'Scheduled daily'}</span>
                  </span>
                  <span>Days {task.start_day}–{task.end_day}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
