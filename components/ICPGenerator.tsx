// components/ICPGenerator.tsx
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ICPGenerator() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!url && !description) {
      setError('Please enter a URL or business description');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/icp-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, businessDescription: description }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate ICP');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-white/5">
      <h2 className="text-2xl font-bold">Find Buyers for Your Business</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://worldtvchannel.online"
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-brand-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Or describe your business</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're selling, key assets, target market..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-brand-500 min-h-[100px]"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-brand-500 text-black font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating buyer personas...
            </span>
          ) : (
            'Find Potential Acquirers'
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 mt-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold mb-2">Business Summary</h3>
            <p className="text-muted-foreground">{result.businessSummary}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Potential Buyer Personas ({result.buyerPersonas.length})</h3>
            <div className="space-y-4">
              {result.buyerPersonas.map((persona: any, i: number) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-lg">{persona.title}</h4>
                      <p className="text-sm text-muted-foreground">{persona.industry}</p>
                      <p className="text-sm text-muted-foreground">{persona.companyType}</p>
                      <p className="text-sm mt-2 text-foreground/80">{persona.motivation}</p>
                      {persona.apolloQuery && (
                        <p className="text-xs text-brand-400 mt-1">Search: {persona.apolloQuery}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {result.enrichedLeads[i]?.leads?.length || 0} leads found
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.enrichedLeads.some((l: any) => l.leads.length > 0) && (
            <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-lg">
              <p className="text-sm">
                🎯 {result.enrichedLeads.reduce((acc: number, l: any) => acc + l.leads.length, 0)} potential acquirers found.
                Check your leads dashboard for details.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}