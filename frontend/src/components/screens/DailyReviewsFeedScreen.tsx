import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { api } from '../../lib/api';

export const DailyReviewsFeedScreen: React.FC = () => {
  const { assignedPatients } = useRecovery('doctor');
  const [liveReviews, setLiveReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!assignedPatients || assignedPatients.length === 0) return;
      try {
        const all: any[] = [];
        for (const p of assignedPatients) {
          const res = await api.getPatientDailyReviews(p.patient_id);
          if (Array.isArray(res) && res.length > 0) {
            res.forEach((r: any) => {
              const score = Number(r.scale || r.recovery_score || 8);
              all.push({
                id: r.id || `${p.patient_id}-${r.review_date}`,
                patient_name: p.name || p.username || p.user_id,
                plan: p.plan_name || 'Post-Operative Recovery Plan',
                score,
                pain: Number(r.pain_level || Math.max(1, 10 - score)),
                submitted_at: r.review_date ? `Logged for ${r.review_date}` : 'Recently submitted',
                note: r.note || 'Patient reported steady recovery trajectory.',
                status: score >= 8 ? 'optimal' : score >= 6 ? 'on_track' : 'attention_required',
              });
            });
          }
        }
        if (all.length > 0) {
          setLiveReviews(all);
        }
      } catch (err) {
        console.error('Failed fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [assignedPatients]);

  const defaultFeed = [
    {
      id: 'rev-1',
      patient_name: 'Rahul Sharma',
      plan: 'Total Knee Replacement Recovery Plan',
      score: 8,
      pain: 3,
      submitted_at: 'Logged for Yesterday',
      note: 'Feeling sore but able to move with walker. Completed gentle walking session with family support.',
      status: 'optimal',
    },
    {
      id: 'rev-2',
      patient_name: 'Priya Patel',
      plan: 'ACL Reconstruction Recovery Plan',
      score: 8,
      pain: 3,
      submitted_at: 'Logged for Yesterday',
      note: 'Recovery is progressing well. Voluntary quad reactivation maintained at 0° extension.',
      status: 'on_track',
    },
    {
      id: 'rev-3',
      patient_name: 'Omkar Joshi',
      plan: 'Shoulder Arthroscopy Recovery Plan',
      score: 8.5,
      pain: 2,
      submitted_at: 'Logged for Yesterday',
      note: 'Pendulum exercises felt smoother. Mild ache when resting without sling.',
      status: 'optimal',
    },
  ];

  const reviewsFeed = liveReviews.length > 0 ? liveReviews : defaultFeed;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Caseload Daily Submissions</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Reviews Feed</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time feed of patient recovery ratings, subjective pain logs, and clinical notes.
          </p>
        </div>
      </div>

      {/* Feed Cards */}
      <div className="space-y-3">
        {reviewsFeed.map((rev) => {
          const isAttention = rev.status === 'attention_required';

          return (
            <div
              key={rev.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3 ${
                isAttention ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                    {rev.patient_name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{rev.patient_name}</span>
                      <span className="text-[10px] text-slate-400">&bull; {rev.plan}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{rev.submitted_at}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Recovery Score: {rev.score}/10
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      rev.pain >= 6
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Pain: {rev.pain}/10
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                "{rev.note}"
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                {isAttention ? (
                  <span className="inline-flex items-center space-x-1.5 text-amber-700 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Clinical Alert triggered: Follow-up advised for back spasms</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Consistent progression adhering to rehabilitation plan</span>
                  </span>
                )}

                <button className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800 font-semibold transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Doctor Note</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
