"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HeaderTop from "@/components/header/HeaderTop";
import { defaultSetting as settings } from "@/libs/defaults";
import Link from 'next/link';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/modules/analytics/global')
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching analytics:", err));
  }, []);

  if (!data) return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url={settings.paths.home.source} />
      </DashboardHeader>
      <div className="p-8 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
    </DashboardWrapper>
  );

  const { boards, timeline } = data;

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url={settings.paths.home.source} />
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="btn btn-sm btn-ghost">← Back</Link>
          <h1 className="text-xl font-bold">Analytics</h1>
        </div>
      </DashboardHeader>

      <div className="p-6 space-y-8">

        {/* Timeline Visualization (Simple Bar Chart) */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Last 30 Days Activity</h2>
            <div className="flex items-end space-x-1 h-64 pt-4 w-full">
              {timeline && timeline.length > 0 ? timeline.map((day, i) => {
                const maxVal = Math.max(...timeline.map(t => (t.views || 0) + (t.posts || 0) + (t.votes || 0) + (t.comments || 0))) || 1;
                const val = (day.views || 0) + (day.posts || 0) + (day.votes || 0) + (day.comments || 0);
                const height = Math.max((val / maxVal) * 100, 2); // min 2% height for visibility
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end group relative">
                    <div className="tooltip tooltip-primary w-full h-full flex items-end" data-tip={`${new Date(day._id).toLocaleDateString()}: ${val} events`}>
                      <div className="bg-primary opacity-70 hover:opacity-100 transition-all rounded-t w-full" style={{ height: `${height}%` }}></div>
                    </div>
                  </div>
                );
              }) : <div className="text-center w-full opacity-50">No data available yet</div>}
            </div>
            <div className="flex justify-between text-xs opacity-50 mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Boards Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Board Performance</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Board Name</th>
                    <th>Views</th>
                    <th>Posts</th>
                    <th>Votes</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {boards && boards.length > 0 ? boards.map(board => (
                    <tr key={board._id}>
                      <td className="font-bold">{board.name}</td>
                      <td>{board.totalViews || 0}</td>
                      <td>{board.totalPosts || 0}</td>
                      <td>{board.totalVotes || 0}</td>
                      <td>{board.totalComments || 0}</td>
                    </tr>
                  )) : <tr><td colSpan="5" className="text-center">No boards found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </DashboardWrapper>
  );
}
