// components/OutreachDashboard.tsx
import { useState, useEffect } from 'react';
import { Play, Pause, BarChart3, Users, Mail, MessageCircle } from 'lucide-react';

export function OutreachDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const startCampaign = async () => {
    if (!selectedLeads.length) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/outreach/sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: selectedLeads,
          campaignName: `Acquisition ${new Date().toLocaleDateString()}`,
        }),
      });
      const data = await response.json();
      console.log('Campaign started:', data);
      // Refresh campaigns list
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to start campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    const response = await fetch('/api/outreach/campaigns');
    const data = await response.json();
    setCampaigns(data);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Outreach Campaigns</h2>
        <button
          onClick={startCampaign}
          disabled={loading || !selectedLeads.length}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-black rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {loading ? 'Starting...' : 'Start Campaign'}
        </button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Total Leads</span>
          </div>
          <p className="text-2xl font-bold mt-1">
            {campaigns.reduce((acc: number, c: any) => acc + c.total_leads, 0)}
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Emails Sent</span>
          </div>
          <p className="text-2xl font-bold mt-1">
            {campaigns.reduce((acc: number, c: any) => acc + c.emails_sent, 0)}
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Sent</span>
          </div>
          <p className="text-2xl font-bold mt-1">
            {campaigns.reduce((acc: number, c: any) => acc + c.whatsapp_sent, 0)}
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span>Response Rate</span>
          </div>
          <p className="text-2xl font-bold mt-1">
            {campaigns.length > 0 ? 
              `${Math.round((campaigns.reduce((acc: number, c: any) => acc + c.responses, 0) / 
                campaigns.reduce((acc: number, c: any) => acc + c.total_leads, 0)) * 100)}%` : 
              '0%'}
          </p>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {campaigns.map((campaign: any) => (
          <div key={campaign.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{campaign.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {campaign.total_leads} leads · {campaign.status}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {campaign.steps_completed}/{campaign.steps?.length || 4} steps
                </span>
                <button className="p-1 hover:bg-white/10 rounded">
                  <Pause className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ 
                  width: `${((campaign.steps_completed || 0) / (campaign.steps?.length || 4)) * 100}%` 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}