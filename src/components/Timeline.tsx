import React from 'react';
import { MessageSquare, RefreshCw, User, Clock } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface Props {
  events: TimelineEvent[];
}

export function Timeline({ events }: Props) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'status_change':
        return <RefreshCw size={16} className="text-green-500" />;
      case 'assignment':
        return <User size={16} className="text-purple-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Timeline</h3>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="flex gap-3">
            <div className="mt-1">{getEventIcon(event.type)}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{event.description}</p>
              <div className="flex gap-2 text-xs text-gray-500 mt-1">
                <span>{event.user}</span>
                <span>•</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}