import React from 'react';
import { Users, MessageSquare, UserPlus, Shield } from 'lucide-react';
import type { Team, User, Comment } from '../types';

interface Props {
  team: Team;
  comments: Comment[];
  users: User[];
  onAddComment: (comment: Omit<Comment, 'id'>) => void;
  onAddTeamMember: (userId: string) => void;
}

export function TeamCollaboration({ team, comments, users, onAddComment, onAddTeamMember }: Props) {
  const [newComment, setNewComment] = React.useState('');
  const [showAddMember, setShowAddMember] = React.useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment({
        content: newComment,
        userId: 'current-user', // In a real app, this would be the actual user ID
        createdAt: new Date().toISOString(),
      });
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="text-blue-500" size={24} />
          <h3 className="text-lg font-semibold">{team.name} Team</h3>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <UserPlus size={16} />
          Add Member
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {team.members.map(member => (
          <div
            key={member.id}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">{member.name}</span>
            <span className="text-xs text-gray-500">({member.role})</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <MessageSquare size={20} />
          Team Discussion
        </h4>

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">
                  {users.find(u => u.id === comment.userId)?.name}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {showAddMember && (
        <AddMemberModal
          users={users.filter(u => !team.members.some(m => m.id === u.id))}
          onAdd={onAddTeamMember}
          onClose={() => setShowAddMember(false)}
        />
      )}
    </div>
  );
}

interface AddMemberModalProps {
  users: User[];
  onAdd: (userId: string) => void;
  onClose: () => void;
}

function AddMemberModal({ users, onAdd, onClose }: AddMemberModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Team Member</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Shield size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => {
                onAdd(user.id);
                onClose();
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <span className="text-sm text-gray-500">{user.role}</span>
            </button>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No available users to add</p>
          </div>
        )}
      </div>
    </div>
  );
}