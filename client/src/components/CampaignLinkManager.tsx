/*
 * CAMPAIGN LINK MANAGER
 * Create, manage, and view campaign links for multi-channel tracking
 */
import { useState } from 'react';
import { Plus, Copy, Trash2, Eye, Settings } from 'lucide-react';
import { CampaignLink, mockCampaignLinks } from '@/lib/campaignLinkData';
import { toast } from 'sonner';

interface CampaignLinkManagerProps {
  onSelectLink: (link: CampaignLink) => void;
}

export default function CampaignLinkManager({ onSelectLink }: CampaignLinkManagerProps) {
  const [links, setLinks] = useState<CampaignLink[]>(mockCampaignLinks);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    destinationUrl: '',
    description: '',
  });

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.destinationUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newLink: CampaignLink = {
      id: `link-${Date.now()}`,
      name: formData.name,
      shortCode: formData.name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(7).toUpperCase(),
      destinationUrl: formData.destinationUrl,
      description: formData.description,
      createdAt: new Date(),
      isActive: true,
      channels: [],
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      overallRoi: 0,
      bestPerformingChannel: 'Social Media',
    };

    setLinks([newLink, ...links]);
    setFormData({ name: '', destinationUrl: '', description: '' });
    setShowCreateForm(false);
    toast.success('Campaign link created successfully!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success('Campaign link deleted');
  };

  return (
    <div className="space-y-6">
      {/* Create New Link Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Links</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign Link
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Campaign Link</h3>
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Q1 Product Launch"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL *</label>
              <input
                type="url"
                value={formData.destinationUrl}
                onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                placeholder="https://example.com/product"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the campaign purpose..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Link
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{link.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    link.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {link.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{link.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectLink(link)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(link.shortCode)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy Short Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Link Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase">Short Code</p>
                <p className="text-sm font-mono font-semibold text-gray-900">{link.shortCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Clicks</p>
                <p className="text-sm font-semibold text-gray-900">{link.totalClicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Conversions</p>
                <p className="text-sm font-semibold text-gray-900">{link.totalConversions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Revenue</p>
                <p className="text-sm font-semibold text-gray-900">${(link.totalRevenue / 1000).toFixed(1)}K</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Best Channel</p>
                <p className="text-sm font-semibold text-gray-900">{link.bestPerformingChannel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
