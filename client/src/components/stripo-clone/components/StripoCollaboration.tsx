import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  UserPlus,
  MessageSquare,
  CheckCircle,
  Clock,
  Mail,
  MoreVertical,
  Crown,
  Eye,
  Edit,
  Trash2,
  Reply,
  Send
} from 'lucide-react';
import { StripoUser, StripoComment } from '../types/stripo.types';
import { formatDistanceToNow } from 'date-fns';

interface StripoCollaborationProps {
  collaborators: StripoUser[];
  activeUsers: StripoUser[];
  comments: StripoComment[];
  onAddComment: (componentId: string, content: string, position?: { x: number; y: number }) => void;
  onResolveComment: (commentId: string) => void;
  onInviteUser: (email: string, role: StripoUser['role']) => void;
  onClose: () => void;
  user?: StripoUser;
}

export function StripoCollaboration({
  collaborators,
  activeUsers,
  comments,
  onAddComment,
  onResolveComment,
  onInviteUser,
  onClose,
  user
}: StripoCollaborationProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'comments'>('users');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<StripoUser['role']>('editor');
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const unresolvedComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  const handleInviteUser = () => {
    if (inviteEmail.trim()) {
      onInviteUser(inviteEmail, inviteRole);
      setInviteEmail('');
      setInviteRole('editor');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment('general', newComment);
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      // In a real implementation, this would add a reply to the comment
      console.log('Adding reply to comment:', commentId, replyContent);
      setReplyingTo(null);
      setReplyContent('');
    }
  };

  const getRoleIcon = (role: StripoUser['role']) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'editor': return <Edit className="w-4 h-4 text-blue-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getRoleBadgeColor = (role: StripoUser['role']) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const UserCard = ({ user }: { user: StripoUser }) => {
    const isActive = activeUsers.some(u => u.id === user.id);
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-medium text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {isActive && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm">{user.name}</h4>
                  {getRoleIcon(user.role)}
                </div>
                <p className="text-xs text-gray-500">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  {isActive && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Online
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="p-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CommentCard = ({ comment }: { comment: StripoComment }) => {
    const timeSince = formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true });
    
    return (
      <Card className={`${comment.resolved ? 'opacity-60' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-medium text-gray-600">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{comment.userName}</p>
                <p className="text-xs text-gray-500">{timeSince}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {comment.resolved && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="p-1">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-800 mb-3">{comment.content}</p>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 space-y-2 mb-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 p-2 rounded text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-xs">{reply.userName}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700">{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply Input */}
          {replyingTo === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleReply(comment.id)}>
                  <Send className="w-3 h-3 mr-1" />
                  Reply
                </Button>
                <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
              
              {!comment.resolved && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResolveComment(comment.id)}
                  className="text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolve
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Collaboration
            </span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {activeUsers.length} online
              </Badge>
              <Badge variant="outline" className="text-xs">
                {unresolvedComments.length} comments
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Team ({collaborators.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Comments ({unresolvedComments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="flex-1 overflow-hidden">
            <div className="space-y-4 h-full">
              {/* Invite User */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Team Member
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="inviteEmail" className="text-sm">Email Address</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inviteRole" className="text-sm">Role</Label>
                      <Select value={inviteRole} onValueChange={(value: StripoUser['role']) => setInviteRole(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer - Can view only</SelectItem>
                          <SelectItem value="editor">Editor - Can edit</SelectItem>
                          <SelectItem value="owner">Owner - Full access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleInviteUser} disabled={!inviteEmail.trim()}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </CardContent>
              </Card>

              {/* Team Members */}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-medium mb-3">Team Members</h3>
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => (
                      <UserCard key={collaborator.id} user={collaborator} />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 overflow-hidden">
            <div className="space-y-4 h-full">
              {/* Add Comment */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment about this template..."
                    rows={3}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Comments</h3>
                  <div className="flex space-x-2 text-sm text-gray-500">
                    <span>{unresolvedComments.length} open</span>
                    <span>•</span>
                    <span>{resolvedComments.length} resolved</span>
                  </div>
                </div>

                <ScrollArea className="h-full pr-4">
                  <div className="space-y-3">
                    {/* Unresolved Comments */}
                    {unresolvedComments.map((comment) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}

                    {/* Resolved Comments */}
                    {resolvedComments.length > 0 && (
                      <>
                        <div className="flex items-center space-x-2 my-4">
                          <div className="h-px bg-gray-300 flex-1"></div>
                          <span className="text-sm text-gray-500">Resolved Comments</span>
                          <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        {resolvedComments.map((comment) => (
                          <CommentCard key={comment.id} comment={comment} />
                        ))}
                      </>
                    )}

                    {comments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No comments yet</p>
                        <p className="text-sm">Add the first comment to start a discussion</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Real-time collaboration • Changes sync automatically
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}