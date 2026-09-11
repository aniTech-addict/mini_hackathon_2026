import React from 'react';
import { CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

export const DailyReviewsFeedScreen: React.FC = () => {
  const reviewsFeed = [
    {
      id: 'rev-1',
      patient_name: 'Maya Patel',
      plan: 'Post-operative knee recovery',
      score: 8,
      pain: 3,
      submitted_at: 'Today at 10:00 AM',
      note: 'Swelling noticeably lower today; walked 15 mins with single crutch. No pain during quad sets.',
      status: 'optimal',
    },
    {
      id: 'rev-2',
      patient_name: 'Sara Khan',
      plan: 'Shoulder mobility program',
      score: 7,
      pain: 4,
      submitted_at: 'Yesterday at 06:15 PM',
      note: 'Shoulder pendulum exercises felt smoother. Mild ache when sleeping without sling.',
      status: 'on_track',
    },
    {
      id: 'rev-3',
      patient_name: 'Vivek Shah',
      plan: 'Cardiac recovery support',
      score: 9,
      pain: 1,
      submitted_at: 'Yesterday at 05:00 PM',
      note: 'Completed 20 minute continuous hallway walk. Blood pressure 122/78 mmHg.',
      status: 'optimal',
    },
    {
      id: 'rev-4',
      patient_name: 'Arjun Mehta',
      plan: 'Lower back rehabilitation',
      score: 4,
      pain: 7,
      submitted_at: '2 days ago at 08:30 PM',
      note: 'Stabbing sensation in L5 region when transitioning to standing. Overdue for Day 11 and 12 review.',
      status: 'attention_required',
    },
  ];

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
                    {rev.patient_name.split(' ').map((n) => n[0]).join('')}
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
