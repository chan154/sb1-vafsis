import React from 'react';
import { Globe, Database, Search } from 'lucide-react';
import type { ExternalReference } from '../types';

interface Props {
  references: ExternalReference[];
  onAddReference: (ref: Omit<ExternalReference, 'id'>) => void;
}

export function ExternalReferences({ references, onAddReference }: Props) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const sourceIcons = {
    CVE: <Database size={16} className="text-purple-500" />,
    NVD: <Globe size={16} className="text-blue-500" />,
    MITRE: <Database size={16} className="text-green-500" />,
    OWASP: <Shield size={16} className="text-orange-500" />,
  };

  const handleSearch = async () => {
    // Simulate external API call
    console.log('Searching for:', searchQuery);
    // In a real app, this would call the actual vulnerability database APIs
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">External References</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Reference
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search external databases..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
        >
          <Search size={16} />
          Search
        </button>
      </div>

      <div className="space-y-3">
        {references.map(ref => (
          <div key={ref.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
            <div className="mt-1">{sourceIcons[ref.source]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{ref.source}</span>
                <span className="text-sm text-gray-500">{ref.id}</span>
              </div>
              {ref.description && (
                <p className="text-sm text-gray-600 mt-1">{ref.description}</p>
              )}
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline mt-1 inline-block"
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>

      {references.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <Database className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-500">No external references linked</p>
        </div>
      )}

      {isAdding && (
        <AddReferenceForm
          onSubmit={(ref) => {
            onAddReference(ref);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  );
}

interface AddReferenceFormProps {
  onSubmit: (ref: Omit<ExternalReference, 'id'>) => void;
  onCancel: () => void;
}

function AddReferenceForm({ onSubmit, onCancel }: AddReferenceFormProps) {
  const [reference, setReference] = React.useState<Omit<ExternalReference, 'id'>>({
    source: 'CVE',
    id: '',
    url: '',
    description: '',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Add External Reference</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={reference.source}
              onChange={(e) => setReference({ ...reference, source: e.target.value as ExternalReference['source'] })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="CVE">CVE</option>
              <option value="NVD">NVD</option>
              <option value="MITRE">MITRE</option>
              <option value="OWASP">OWASP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
            <input
              type="text"
              value={reference.id}
              onChange={(e) => setReference({ ...reference, id: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              value={reference.url}
              onChange={(e) => setReference({ ...reference, url: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={reference.description}
              onChange={(e) => setReference({ ...reference, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reference)}
            disabled={!reference.id || !reference.url}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Add Reference
          </button>
        </div>
      </div>
    </div>
  );
}