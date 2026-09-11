import { AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import type { CareAlert } from '../lib/schemas/recovery';

interface AlertsDrawerProps {
  role: 'patient' | 'doctor';
  alerts: CareAlert[];
  onResolveAlert: (id: string) => void;
  onOpenReviewModal?: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  role,
  alerts,
  onResolveAlert,
  onOpenReviewModal,
}) => {
  const isDoctor = role === 'doctor';

  const severityStyles = {
    critical: 'bg-red-50/80 border-red-200/80 text-red-900',
    high: 'bg-rose-50/80 border-rose-200/80 text-rose-900',
    medium: 'bg-amber-50/70 border-amber-200/70 text-amber-900',
    low: 'bg-blue-50/70 border-blue-200/70 text-blue-900',
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            {isDoctor ? 'ALERTS' : 'CARE ALERTS'}
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            {isDoctor ? 'Care team attention' : 'Keep an eye on these'}
          </h3>
        </div>
        <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
          {isDoctor ? 'View history' : 'See all'}
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            <Check className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
            No active alerts at this time.
          </div>
        ) : (
          alerts.map((alert) => {
            const cardStyle = severityStyles[alert.severity] || severityStyles.medium;

            return (
              <div
                key={alert.id}
                className={`p-4 border rounded-xl flex items-start justify-between gap-3 transition-all ${cardStyle}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="shrink-0 mt-0.5">
                    {alert.severity === 'critical' ? (
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{alert.title}</div>
                    <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {alert.message}
                    </div>
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="shrink-0">
                  {isDoctor ? (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline transition-colors"
                    >
                      Resolve
                    </button>
                  ) : (
                    onOpenReviewModal && (
                      <button
                        onClick={onOpenReviewModal}
                        className="text-xs font-semibold bg-white border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg hover:bg-amber-50 transition-colors shadow-2xs"
                      >
                        Check-in
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
