'use client';

import { useState } from 'react';

interface Download {
  id: string;
  name: string;
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  peers: number;
  size: string;
  status: 'downloading' | 'seeding' | 'paused' | 'completed';
}

export default function DownloadsPage() {
  const [downloads] = useState<Download[]>([]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Downloads</h1>
      <p className="text-zinc-400 text-sm mb-8">Manage your WebTorrent downloads — peer-to-peer in the browser.</p>

      {downloads.length === 0 ? (
        <div className="text-center py-20 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-lg font-semibold mb-2">No Active Downloads</h2>
          <p className="text-sm text-zinc-500 mb-4">Browse packages and click download to start a P2P transfer.</p>
          <a href="/browse" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            Browse Packages
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {downloads.map(dl => (
            <div key={dl.id} className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{dl.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${dl.status === 'downloading' ? 'bg-blue-500/10 text-blue-400' : dl.status === 'seeding' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {dl.status}
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${dl.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{dl.progress.toFixed(1)}% • {dl.size}</span>
                <div className="flex items-center gap-3">
                  <span>↓ {(dl.downloadSpeed / 1024).toFixed(0)} KB/s</span>
                  <span>↑ {(dl.uploadSpeed / 1024).toFixed(0)} KB/s</span>
                  <span>{dl.peers} peers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function register() {
            if (!navigator.modelContext || !navigator.modelContext.registerTool) return;
            const mc = navigator.modelContext;
            mc.registerTool({ name: "list_downloads", description: "List active downloads", inputSchema: { type: "object", properties: {} }, handler: async () => ({ downloads: [] }) });
            mc.registerTool({ name: "get_download_status", description: "Get download status", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] }, handler: async () => ({ status: "no active downloads" }) });
          }
          if (navigator.modelContext) register();
          else window.addEventListener('modelcontextready', register);
        })();
      `}} />
    </div>
  );
}
