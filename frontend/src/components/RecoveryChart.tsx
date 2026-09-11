import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const DEFAULT_CHART_DATA = [
  { date: '01 Sep', score: 4, pain: 7 },
  { date: '03 Sep', score: 5, pain: 6 },
  { date: '05 Sep', score: 6, pain: 5 },
  { date: '07 Sep', score: 7, pain: 4 },
  { date: '09 Sep', score: 8, pain: 3 },
  { date: '11 Sep', score: 8, pain: 3 },
];

interface RecoveryChartProps {
  data?: Array<{ date: string; score: number; pain: number }>;
}

export const RecoveryChart: React.FC<RecoveryChartProps> = ({ data = DEFAULT_CHART_DATA }) => {
  // Tracker data across 14 post-op recovery days
  const trackerData = [
    { color: 'bg-emerald-500', tooltip: 'Day 1: Completed 100%' },
    { color: 'bg-emerald-500', tooltip: 'Day 2: Completed 100%' },
    { color: 'bg-emerald-500', tooltip: 'Day 3: Completed 100%' },
    { color: 'bg-emerald-500', tooltip: 'Day 4: Completed 100%' },
    { color: 'bg-emerald-500', tooltip: 'Day 5: Completed 100%' },
    { color: 'bg-amber-400', tooltip: 'Day 6: 75% Tasks' },
    { color: 'bg-emerald-500', tooltip: 'Day 7: Completed 100%' },
    { color: 'bg-emerald-500', tooltip: 'Day 8: Completed 100%' },
    { color: 'bg-amber-400', tooltip: 'Day 9: 75% Tasks' },
    { color: 'bg-emerald-500', tooltip: 'Day 10: Completed 100%' },
    { color: 'bg-emerald-500', tooltip: 'Day 11: Completed 100%' },
    { color: 'bg-slate-200', tooltip: 'Day 12: Upcoming' },
    { color: 'bg-slate-200', tooltip: 'Day 13: Upcoming' },
    { color: 'bg-slate-200', tooltip: 'Day 14: Upcoming' },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header & Delta Badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Adherence &amp; Recovery Trend</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Daily Recovery Score (0–10)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Tracking self-reported recovery score and pain scale over time</p>
        </div>

        <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>+67% Recovery Pace</span>
        </div>
      </div>

      {/* AreaChart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="recoveryEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-lg border border-slate-800">
                      <div className="font-bold text-slate-200 mb-1">{label}</div>
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>Recovery Score: <strong>{payload[0].value}/10</strong></span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#recoveryEmerald)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tremor Tracker component */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span>Adherence Tracker (Past 14 Days)</span>
          <span className="text-emerald-700">91% Compliance</span>
        </div>
        <div className="flex items-center space-x-1.5 h-5 w-full">
          {trackerData.map((item, idx) => (
            <div
              key={idx}
              title={item.tooltip}
              className={`h-4 flex-1 rounded-sm ${item.color} transition-opacity hover:opacity-80 cursor-pointer`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
