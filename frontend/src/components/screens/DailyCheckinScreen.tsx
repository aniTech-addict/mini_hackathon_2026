import React, { useState } from 'react';
import { CheckSquare, Send, CheckCircle2, HeartPulse, History, Sparkles } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const DailyCheckinScreen: React.FC = () => {
  const { submitReview, reviewsChart } = useRecovery('patient');
  const [score, setScore] = useState<number>(8);
  const [painLevel, setPainLevel] = useState<number>(3);
  const [note, setNote] = useState<string>('Knee feels stable today with mild stiffness in morning. Completed 15 min walk.');
  const [submittedToday, setSubmittedToday] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview.mutate(
      { scale: score, note: `Recovery Score: ${score}/10, Pain: ${painLevel}/10 - ${note}` },
      {
        onSuccess: () => {
          setSubmittedToday(true);
        },
      }
    );
  };

  const scoreLabels: Record<number, string> = {
    1: 'Extremely poor / Severe discomfort',
    2: 'Very poor / Significant impairment',
    3: 'Poor / Persistent distress',
    4: 'Sub-optimal / Noticeable stiffness',
    5: 'Moderate / Bearable discomfort',
    6: 'Fair / Mild improvement',
    7: 'Good / Noticeable daily progress',
    8: 'Very Good / High functional mobility',
    9: 'Excellent / Near complete restoration',
    10: 'Optimal / Symptom-free peak recovery',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Daily Clinical Review Check-in</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Recovery Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit your daily subjective ratings so Dr. Ananya Rao can dynamically calibrate your rehabilitation plan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          {submittedToday ? (
            <div className="py-12 flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Review Submitted Successfully!</h2>
              <p className="text-xs text-slate-500 max-w-md">
                Your recovery score of <strong className="text-emerald-700">{score}/10</strong> has been transmitted to Dr. Ananya Rao's clinical dashboard.
              </p>
              <button
                onClick={() => setSubmittedToday(false)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Submit another update
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Score Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                    <HeartPulse className="w-4 h-4 text-emerald-600" />
                    <span>Overall Recovery Rating (0–10 Scale)</span>
                  </label>
                  <span className="text-base font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {score} / 10
                  </span>
                </div>

                <div className="grid grid-cols-10 gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setScore(val)}
                      className={`h-11 rounded-xl text-xs font-bold transition-all ${
                        score === val
                          ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105 ring-2 ring-emerald-700'
                          : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-emerald-800 font-medium mt-2.5 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{scoreLabels[score]}</span>
                </div>
              </div>

              {/* Pain Level Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Pain Level Today (0 = No Pain, 10 = Severe Pain)
                  </label>
                  <span className="text-xs font-semibold text-slate-600">{painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>0 - Zero Pain</span>
                  <span>5 - Moderate Pain</span>
                  <span>10 - Unbearable</span>
                </div>
              </div>

              {/* Notes input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Subjective Notes & Observations
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  placeholder="Describe joint mobility, swelling, stiffness, or tolerance during exercises..."
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitReview.isPending}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitReview.isPending ? 'Transmitting Review...' : 'Submit Daily Check-in'}</span>
              </button>
            </form>
          )}
        </div>

        {/* History Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Recent Review Logs</span>
          </div>

          <div className="space-y-3">
            {reviewsChart.map((rev, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{rev.date} 2026</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Score: {rev.score}/10
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Pain: {rev.pain}/10
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Logged on schedule. Recovery metric trajectory shows steady improvement.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
