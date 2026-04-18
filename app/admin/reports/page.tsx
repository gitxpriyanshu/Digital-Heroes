'use client';

import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  Trophy,
  Activity
} from 'lucide-react';

const subscriberData = [
  { name: 'Jan', total: 120, growth: 10 },
  { name: 'Feb', total: 210, growth: 15 },
  { name: 'Mar', total: 340, growth: 22 },
  { name: 'Apr', total: 540, growth: 30 },
  { name: 'May', total: 720, growth: 25 },
];

const prizePoolData = [
  { name: 'Jan', amount: 1200 },
  { name: 'Feb', amount: 2100 },
  { name: 'Mar', amount: 3400 },
  { name: 'Apr', amount: 5400 },
  { name: 'May', amount: 7200 },
];

const charityData = [
  { name: 'Golf for All', value: 4500, color: '#10b981' },
  { name: 'Junior Links', value: 3000, color: '#06b6d4' },
  { name: 'The Fairway Trust', value: 2500, color: '#6366f1' },
];

export default function AdminReports() {
  return (
    <div className="space-y-12 pb-24">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Platform Reports</h1>
        <p className="text-white/40">In-depth analysis of subscriber growth and social impact.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscriber Growth */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-emerald-400 w-5 h-5" />
            <h3 className="font-bold text-lg">Member Growth History</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subscriberData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prize Pool Progression */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="text-amber-400 w-5 h-5" />
            <h3 className="font-bold text-lg">Monthly Prize Liquidity</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prizePoolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charity Distribution */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="text-rose-400 w-5 h-5" />
            <h3 className="font-bold text-lg">Charitable Distribution</h3>
          </div>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {charityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Draw Statistics Summary */}
        <div className="p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="text-emerald-400 w-5 h-5" />
            <h3 className="font-bold text-lg">Network Health Summary</h3>
          </div>
          <div className="space-y-8">
            <ReportStat label="Average Stableford Score" value="34.2" detail="Across all members" />
            <ReportStat label="Match Probability (3+)" value="12.4%" detail="Based on active pool" />
            <ReportStat label="Jackpot Conversion" value="4.2%" detail="Historical avg" />
            <ReportStat label="Total Impact Generated" value="£284,500" detail="Life-time platform total" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReportStatProps {
  label: string;
  value: string;
  detail: string;
}

function ReportStat({ label, value, detail }: ReportStatProps) {
  return (
    <div className="flex justify-between items-end border-b border-emerald-500/10 pb-4">
      <div>
        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">{label}</p>
        <p className="text-sm text-white/60">{detail}</p>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}
