
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Lead } from '../types';

const mockLeads: Lead[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'new', value: 2500, date: '2024-05-15' },
  { id: '2', name: 'Alice Smith', email: 'alice@coffee.ro', status: 'contacted', value: 4800, date: '2024-05-14' },
  { id: '3', name: 'Mark Wilson', email: 'm.wilson@tech.co', status: 'contracted', value: 12000, date: '2024-05-12' },
  { id: '4', name: 'Sarah Connor', email: 'sarah@skynet.ai', status: 'completed', value: 7500, date: '2024-05-10' },
  { id: '5', name: 'Bob Brown', email: 'bob@builders.net', status: 'new', value: 3200, date: '2024-05-08' },
];

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 75000 },
  { month: 'Jun', revenue: 89000 },
];

const Dashboard: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setIsEditing(id);
    alert(`Editing lead ${id}. (Mock editing enabled)`);
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Control Panel</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Studio Intelligence</h1>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Export Performance</button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10">+ Manual Inquiry</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Active Nodes", value: "24", change: "+12%", up: true },
          { label: "Gross Forecast", value: "$328.4k", change: "+8.2%", up: true },
          { label: "Avg Ticket", value: "$8.5k", change: "-2.1%", up: false },
          { label: "AI Conversion", value: "18.5%", change: "+4.3%", up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
              <span className={`text-xs font-black px-2 py-1 rounded-lg ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue Trajectory</h3>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-4 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white">
          <h3 className="text-lg font-black mb-10 tracking-tight">Lead Pipeline</h3>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { status: 'New', count: 12 },
                { status: 'Contact', count: 19 },
                { status: 'Review', count: 8 },
                { status: 'Live', count: 15 },
              ]}>
                <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={10} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff'}} />
                <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 8, 8]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Operational Inbox</h3>
          <div className="flex gap-2">
             <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{mockLeads.length} Total</div>
          </div>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Architect / Client</th>
                <th className="px-8 py-5">Phase</th>
                <th className="px-8 py-5 text-right">Budget</th>
                <th className="px-8 py-5 text-right">Timestamp</th>
                <th className="px-8 py-5 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-400 font-medium tracking-tight">{lead.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      lead.status === 'new' ? 'bg-indigo-50 text-indigo-600' :
                      lead.status === 'contacted' ? 'bg-amber-50 text-amber-600' :
                      lead.status === 'contracted' ? 'bg-fuchsia-50 text-fuchsia-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-slate-900 tracking-tighter">
                    ${lead.value.toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-right text-slate-400 text-xs font-bold font-mono uppercase">
                    {lead.date}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleEdit(lead.id)}
                      className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all ml-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
