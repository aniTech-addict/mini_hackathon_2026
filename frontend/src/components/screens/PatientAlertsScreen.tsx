import React, { useState } from 'react';
import { Bell, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const PatientAlertsScreen: React.FC = () => {
  const { patientAlerts, resolveAlert } = useRecovery('patient');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredAlerts = patientAlerts.filter((alert: any) => {
    if (filter === 'unread') return !alert.is_read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Care Team Alerts & Notifications</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recovery Alerts Feed</h1>
          <p className="text-sm text-slate-500 mt-1">
            Clinical reminders, daily review prompts, and prescription alerts from Dr. Rao.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Alerts ({patientAlerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="divide-y divide-slate-100">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShieldCheck className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <div className="text-sm font-semibold text-slate-700">All alerts resolved!</div>
              <div className="text-xs">No unread notifications at this time.</div>
            </div>
          ) : (
            filteredAlerts.map((alert: any) => {
              const isCritical = alert.severity === 'critical';
              const isMedium = alert.severity === 'medium';

              return (
                <div key={alert.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-rose-50 text-rose-600'
                          : isMedium
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isCritical
                              ? 'bg-rose-100 text-rose-700'
                              : isMedium
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {new Date(alert.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => resolveAlert.mutate(alert.id)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
