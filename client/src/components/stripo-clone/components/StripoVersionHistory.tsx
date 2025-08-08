import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  RotateCcw, 
  Search, 
  Clock, 
  User, 
  FileText,
  Eye,
  Calendar,
  Filter
} from 'lucide-react';
import { StripoVersionHistoryEntry, StripoUser } from '../types/stripo.types';
import { formatDistanceToNow, format } from 'date-fns';

interface StripoVersionHistoryProps {
  history: StripoVersionHistoryEntry[];
  currentIndex: number;
  onRestore: (template: any) => void;
  onClose: () => void;
  user?: StripoUser;
}

export function StripoVersionHistory({
  history,
  currentIndex,
  onRestore,
  onClose,
  user
}: StripoVersionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<StripoVersionHistoryEntry | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'manual' | 'auto'>('all');

  const filteredHistory = history.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'auto' && entry.isAutoSave) ||
      (filterBy === 'manual' && !entry.isAutoSave);
    
    return matchesSearch && matchesFilter;
  });

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'component_add': return 'bg-green-100 text-green-800';
      case 'component_remove': return 'bg-red-100 text-red-800';
      case 'component_update': return 'bg-blue-100 text-blue-800';
      case 'style_change': return 'bg-purple-100 text-purple-800';
      case 'content_change': return 'bg-orange-100 text-orange-800';
      case 'template_settings': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'component_add': return '+';
      case 'component_remove': return '−';
      case 'component_update': return '↻';
      case 'style_change': return '🎨';
      case 'content_change': return '✏️';
      case 'template_settings': return '⚙️';
      default: return '•';
    }
  };

  const handleRestore = (entry: StripoVersionHistoryEntry) => {
    if (window.confirm(`Are you sure you want to restore to this version? This will replace your current work.`)) {
      onRestore(entry.template);
      onClose();
    }
  };

  const VersionCard = ({ entry, index }: { entry: StripoVersionHistoryEntry; index: number }) => {
    const isCurrent = index === currentIndex;
    const timeSince = formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true });
    const fullDate = format(new Date(entry.timestamp), 'PPpp');

    return (
      <Card className={`cursor-pointer transition-all ${isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                entry.isAutoSave ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'
              }`}>
                {entry.isAutoSave ? '⏰' : '💾'}
              </div>
              <div>
                <p className="font-medium text-sm">{entry.description}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {entry.userName}
                  {isCurrent && (
                    <Badge variant="default" className="ml-2 text-xs">Current</Badge>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              <span className="text-xs text-gray-500" title={fullDate}>
                <Clock className="w-3 h-3 inline mr-1" />
                {timeSince}
              </span>
              {entry.isAutoSave && (
                <Badge variant="secondary" className="text-xs">Auto</Badge>
              )}
            </div>
          </div>

          {/* Changes Summary */}
          {entry.changes.length > 0 && (
            <div className="space-y-1 mb-3">
              {entry.changes.slice(0, 3).map((change, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getChangeTypeColor(change.type)}`}>
                    {getChangeIcon(change.type)}
                  </span>
                  <span className="text-gray-600 truncate">{change.description}</span>
                </div>
              ))}
              {entry.changes.length > 3 && (
                <p className="text-xs text-gray-500 ml-6">
                  +{entry.changes.length - 3} more changes
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEntry(entry);
                setShowPreview(true);
              }}
              className="text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
            
            {!isCurrent && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestore(entry);
                }}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Restore
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Version History
            </DialogTitle>
          </DialogHeader>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search versions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex bg-gray-100 rounded-md p-1">
                <Button
                  variant={filterBy === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterBy('all')}
                  className="px-3 py-1 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filterBy === 'manual' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterBy('manual')}
                  className="px-3 py-1 text-xs"
                >
                  Manual
                </Button>
                <Button
                  variant={filterBy === 'auto' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterBy('auto')}
                  className="px-3 py-1 text-xs"
                >
                  Auto-save
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {filteredHistory.length} of {history.length} versions
            </div>
          </div>

          {/* Version List */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No versions found</p>
                  <p className="text-sm">Try adjusting your search or filter</p>
                </div>
              ) : (
                filteredHistory.map((entry, index) => (
                  <VersionCard key={entry.id} entry={entry} index={index} />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t pt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Changes are automatically saved every 30 seconds
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {showPreview && selectedEntry && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Version Preview
                </span>
                <Badge variant="outline">
                  {format(new Date(selectedEntry.timestamp), 'PPpp')}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-hidden flex">
              {/* Preview Content */}
              <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">{selectedEntry.template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Subject: {selectedEntry.template.subject}</p>
                  
                  <div className="space-y-4">
                    {selectedEntry.template.components.map((component: any, idx: number) => (
                      <div key={idx} className="p-3 border border-gray-200 rounded bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {component.type}
                          </Badge>
                          <span className="text-xs text-gray-500">#{component.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-sm">
                          {component.content?.text && (
                            <p className="truncate">{component.content.text.slice(0, 100)}...</p>
                          )}
                          {component.content?.title && (
                            <p className="font-medium">{component.content.title}</p>
                          )}
                          {component.content?.src && (
                            <p className="text-blue-600 truncate">{component.content.src}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Version Details */}
              <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <h4 className="font-medium mb-3">Version Details</h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Description:</span>
                    <p className="font-medium">{selectedEntry.description}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Modified by:</span>
                    <p className="font-medium">{selectedEntry.userName}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{format(new Date(selectedEntry.timestamp), 'PPpp')}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <Badge variant={selectedEntry.isAutoSave ? 'secondary' : 'default'}>
                      {selectedEntry.isAutoSave ? 'Auto-save' : 'Manual save'}
                    </Badge>
                  </div>
                </div>

                {selectedEntry.changes.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-medium mb-3">Changes ({selectedEntry.changes.length})</h5>
                    <div className="space-y-2">
                      {selectedEntry.changes.map((change, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-1.5 py-0.5 rounded font-medium ${getChangeTypeColor(change.type)}`}>
                              {getChangeIcon(change.type)}
                            </span>
                            <span className="text-gray-600">{change.type.replace('_', ' ')}</span>
                          </div>
                          <p className="text-gray-700 ml-6">{change.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
              <Button onClick={() => handleRestore(selectedEntry)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore This Version
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}