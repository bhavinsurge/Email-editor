import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StripoComponent, StripoGlobalStyles } from '../types/stripo.types';
import { Play, Pause, SkipBack, SkipForward, Star, ShoppingCart, User } from 'lucide-react';

interface StripoComponentRendererProps {
  component: StripoComponent;
  isSelected: boolean;
  previewDevice: 'desktop' | 'mobile' | 'tablet';
  globalStyles: StripoGlobalStyles;
  onUpdate: (updates: Partial<StripoComponent>) => void;
}

export function StripoComponentRenderer({
  component,
  isSelected,
  previewDevice,
  globalStyles,
  onUpdate
}: StripoComponentRendererProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState('');

  const handleDoubleClick = useCallback((field: string, currentValue: string) => {
    if (isSelected) {
      setIsEditing(true);
      setEditingValue(currentValue);
    }
  }, [isSelected]);

  const handleEditSubmit = useCallback((field: string) => {
    onUpdate({
      content: {
        ...component.content,
        [field]: editingValue
      }
    });
    setIsEditing(false);
  }, [editingValue, component.content, onUpdate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      handleEditSubmit(field);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  }, [handleEditSubmit]);

  const getResponsiveStyles = () => {
    const baseStyles = component.styles;
    
    if (previewDevice === 'mobile' && baseStyles.mobileStyles) {
      return { ...baseStyles, ...baseStyles.mobileStyles };
    }
    if (previewDevice === 'tablet' && baseStyles.tabletStyles) {
      return { ...baseStyles, ...baseStyles.tabletStyles };
    }
    
    return baseStyles;
  };

  const styles = getResponsiveStyles();

  // Process merge tags (basic implementation)
  const processMergeTags = (text: string): string => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      // In real implementation, this would use actual data
      const mockData: Record<string, string> = {
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corp',
        email: 'john@acme.com'
      };
      return mockData[key] || match;
    });
  };

  switch (component.type) {
    case 'container':
      return (
        <div style={styles} className="w-full">
          {component.children?.map((child, index) => (
            <StripoComponentRenderer
              key={child.id}
              component={child}
              isSelected={false}
              previewDevice={previewDevice}
              globalStyles={globalStyles}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      );

    case 'row':
      return (
        <div style={{ ...styles, display: 'flex' }} className="w-full">
          {component.children?.map((child, index) => (
            <StripoComponentRenderer
              key={child.id}
              component={child}
              isSelected={false}
              previewDevice={previewDevice}
              globalStyles={globalStyles}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      );

    case 'column':
      return (
        <div style={styles} className="flex-1">
          {component.children?.map((child, index) => (
            <StripoComponentRenderer
              key={child.id}
              component={child}
              isSelected={false}
              previewDevice={previewDevice}
              globalStyles={globalStyles}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      );

    case 'text':
      const textContent = component.content?.text || 'Your text content here...';
      
      if (isEditing && isSelected) {
        return (
          <Input
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={() => handleEditSubmit('text')}
            onKeyDown={(e) => handleKeyPress(e, 'text')}
            style={styles}
            autoFocus
          />
        );
      }

      return (
        <div
          style={styles}
          onDoubleClick={() => handleDoubleClick('text', textContent)}
          dangerouslySetInnerHTML={{ __html: processMergeTags(textContent) }}
        />
      );

    case 'heading':
      const headingText = component.content?.text || component.content?.title || 'Your Heading';
      
      return (
        <div style={styles}>
          <h1
            style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit' }}
            onDoubleClick={() => handleDoubleClick('text', headingText)}
          >
            {processMergeTags(headingText)}
          </h1>
          {component.content?.subtitle && (
            <p style={{ margin: '8px 0 0 0', opacity: 0.8 }}>
              {processMergeTags(component.content.subtitle)}
            </p>
          )}
        </div>
      );

    case 'image':
      return (
        <div style={styles}>
          <img
            src={component.content?.src || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop'}
            alt={component.content?.alt || 'Image'}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop';
            }}
          />
        </div>
      );

    case 'button':
      const buttonText = component.content?.text || 'Click Here';
      const buttonHref = component.content?.href || '#';

      return (
        <div style={{ textAlign: styles.textAlign as any, padding: styles.padding }}>
          <a
            href={buttonHref}
            style={{
              ...styles,
              display: 'inline-block',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onDoubleClick={() => handleDoubleClick('text', buttonText)}
          >
            {processMergeTags(buttonText)}
          </a>
        </div>
      );

    case 'divider':
      return (
        <hr
          style={{
            ...styles,
            border: 'none',
            margin: styles.margin || '16px 0'
          }}
        />
      );

    case 'spacer':
      return <div style={styles} />;

    case 'social':
      const socialItems = component.content?.items || [];
      
      return (
        <div style={styles}>
          <div className="flex gap-2 justify-center">
            {socialItems.map((item) => (
              <a
                key={item.id}
                href={item.content}
                className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                title={`Visit our ${item.type}`}
              >
                <span className="text-xs font-bold">
                  {item.type.charAt(0).toUpperCase()}
                </span>
              </a>
            ))}
          </div>
        </div>
      );

    case 'video':
      return (
        <div style={styles}>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Video Player</p>
                <p className="text-xs opacity-75">Click to play</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'html':
      return (
        <div
          style={styles}
          dangerouslySetInnerHTML={{ __html: component.content?.html || '<p>Custom HTML content</p>' }}
        />
      );

    case 'timer':
      return (
        <div style={styles}>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {component.content?.title || 'Limited Time Offer'}
            </h3>
            <p className="text-sm mb-4">
              {component.content?.description || 'Hurry! This offer expires soon.'}
            </p>
            <div className="flex justify-center space-x-4 text-lg font-mono">
              <div className="text-center">
                <div className="bg-black text-white p-2 rounded">23</div>
                <div className="text-xs mt-1">Days</div>
              </div>
              <div className="text-center">
                <div className="bg-black text-white p-2 rounded">15</div>
                <div className="text-xs mt-1">Hours</div>
              </div>
              <div className="text-center">
                <div className="bg-black text-white p-2 rounded">42</div>
                <div className="text-xs mt-1">Minutes</div>
              </div>
              <div className="text-center">
                <div className="bg-black text-white p-2 rounded">18</div>
                <div className="text-xs mt-1">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'product':
      return (
        <div style={styles}>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-semibold mb-1">Product Name</h4>
            <p className="text-sm text-gray-600 mb-2">Brief product description</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">$99.99</span>
              <Button size="sm">Add to Cart</Button>
            </div>
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div style={styles}>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-lg italic mb-4">
              "This is an amazing product! Highly recommended."
            </blockquote>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold">John Smith</div>
                <div className="text-sm text-gray-600">Customer</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div style={styles}>
          <div className="border border-gray-200 rounded-lg p-6 bg-white text-center">
            <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              $29<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Feature 1
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Feature 2
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Feature 3
              </li>
            </ul>
            <Button className="w-full">Choose Plan</Button>
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div style={styles}>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Image {i}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'form':
      return (
        <div style={styles}>
          <div className="space-y-4">
            <Input placeholder="Your Name" />
            <Input type="email" placeholder="Your Email" />
            <Input placeholder="Subject" />
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Your Message"
            />
            <Button className="w-full">Send Message</Button>
          </div>
        </div>
      );

    case 'survey':
      return (
        <div style={styles}>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h3 className="font-semibold mb-3">Quick Survey</h3>
            <p className="text-sm text-gray-600 mb-4">How satisfied are you with our service?</p>
            <div className="space-y-2">
              {['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'].map((option) => (
                <label key={option} className="flex items-center">
                  <input type="radio" name="satisfaction" className="mr-2" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            <Button size="sm" className="mt-4">Submit</Button>
          </div>
        </div>
      );

    case 'game':
      return (
        <div style={styles}>
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Interactive Quiz</h3>
            <p className="mb-4">Test your knowledge and win prizes!</p>
            <div className="bg-white text-gray-900 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Question 1 of 5</p>
              <p className="mb-3">What is the capital of France?</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">London</Button>
                <Button variant="outline" size="sm">Paris</Button>
                <Button variant="outline" size="sm">Berlin</Button>
                <Button variant="outline" size="sm">Madrid</Button>
              </div>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              Start Quiz
            </Button>
          </div>
        </div>
      );

    case 'amp-carousel':
      return (
        <div style={styles}>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <SkipBack className="w-6 h-6" />
                  <Play className="w-8 h-8" />
                  <SkipForward className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">AMP Carousel</p>
                <p className="text-xs">Interactive image slideshow</p>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-blue-500' : 'bg-gray-400'}`} />
              ))}
            </div>
          </div>
        </div>
      );

    case 'amp-accordion':
      return (
        <div style={styles}>
          <div className="space-y-2">
            {['Section 1', 'Section 2', 'Section 3'].map((section, index) => (
              <div key={section} className="border border-gray-200 rounded">
                <div className="p-3 bg-gray-50 font-medium text-sm flex justify-between items-center">
                  {section}
                  <span className="text-gray-400">▼</span>
                </div>
                {index === 0 && (
                  <div className="p-3 text-sm text-gray-600">
                    This is the expanded content for {section}.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'amp-form':
      return (
        <div style={styles}>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h3 className="font-semibold mb-3">AMP Interactive Form</h3>
            <div className="space-y-3">
              <Input placeholder="Name" />
              <Input type="email" placeholder="Email" />
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Choose an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <Button className="w-full">Submit (AMP)</Button>
            </div>
          </div>
        </div>
      );

    case 'amp-list':
      return (
        <div style={styles}>
          <div className="space-y-2">
            <h3 className="font-semibold">Dynamic Content List</h3>
            <div className="text-sm text-gray-600 mb-3">Updates automatically from data source</div>
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                <span>Dynamic Item {item}</span>
                <Button size="sm" variant="outline">View</Button>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div style={styles} className="p-4 border border-dashed border-gray-300 text-center text-gray-500">
          <p>Unknown component type: {component.type}</p>
        </div>
      );
  }
}