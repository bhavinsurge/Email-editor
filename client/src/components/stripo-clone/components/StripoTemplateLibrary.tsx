import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Download,
  Eye,
  Heart,
  Crown,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';
import { StripoTemplate, StripoTemplateCategory, StripoUser } from '../types/stripo.types';

interface StripoTemplateLibraryProps {
  templates: StripoTemplate[];
  categories: StripoTemplateCategory[];
  onTemplateSelect: (templateId: string) => void;
  onSearchTemplates: (query: string, filters?: any) => StripoTemplate[];
  onFavoriteTemplate: (templateId: string) => void;
  onBackToEditor: () => void;
  user?: StripoUser;
}

export function StripoTemplateLibrary({
  templates,
  categories,
  onTemplateSelect,
  onSearchTemplates,
  onFavoriteTemplate,
  onBackToEditor,
  user
}: StripoTemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating' | 'downloads'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Featured categories for quick access
  const featuredCategories = [
    { id: 'popular', name: 'Popular', icon: '🔥', count: templates.filter(t => t.isPopular).length },
    { id: 'new', name: 'New', icon: '✨', count: templates.filter(t => t.isNew).length },
    { id: 'premium', name: 'Premium', icon: '👑', count: templates.filter(t => t.isPremium).length },
    { id: 'free', name: 'Free', icon: '🆓', count: templates.filter(t => t.isFree).length }
  ];

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Search filter
    if (searchQuery.trim()) {
      filtered = onSearchTemplates(searchQuery);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'popular') {
        filtered = filtered.filter(t => t.isPopular);
      } else if (selectedCategory === 'new') {
        filtered = filtered.filter(t => t.isNew);
      } else if (selectedCategory === 'premium') {
        filtered = filtered.filter(t => t.isPremium);
      } else if (selectedCategory === 'free') {
        filtered = filtered.filter(t => t.isFree);
      } else {
        filtered = filtered.filter(t => t.category === selectedCategory);
      }
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(t => t.industry.includes(industryFilter));
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(t => t.difficulty === difficultyFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.purpose.includes(typeFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'recent':
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, searchQuery, selectedCategory, industryFilter, difficultyFilter, typeFilter, sortBy, onSearchTemplates]);

  const TemplateCard = ({ template }: { template: StripoTemplate }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop';
          }}
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTemplateSelect(template.id);
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTemplateSelect(template.id);
              }}
            >
              Use Template
            </Button>
          </div>
        </div>

        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {template.isNew && (
            <Badge className="bg-green-500 text-white text-xs">
              New
            </Badge>
          )}
          {template.isPremium && (
            <Badge className="bg-yellow-500 text-white text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {template.isPopular && (
            <Badge className="bg-red-500 text-white text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 hover:bg-opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteTemplate(template.id);
          }}
        >
          <Heart className={`w-4 h-4 ${template.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">{template.name}</h3>
          <div className="flex items-center text-xs text-gray-500 ml-2">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {template.rating.toFixed(1)}
          </div>
        </div>
        
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{template.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Download className="w-3 h-3 mr-1" />
              {template.downloads.toLocaleString()}
            </span>
            <span className="flex items-center">
              <Grid3X3 className="w-3 h-3 mr-1" />
              {template.components}
            </span>
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {template.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBackToEditor}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template Library</h1>
              <p className="text-sm text-gray-600">Choose from {templates.length}+ professional email templates</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
            
            <div className="flex bg-gray-100 rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-2 py-1"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-2 py-1"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="downloads">Most Downloaded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Templates
          </Button>
          {featuredCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center"
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({cat.templateCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Industry</Label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setIndustryFilter('all');
                setDifficultyFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}