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

  // Convert styles to React CSSProperties
  const getReactStyles = (): React.CSSProperties => {
    const reactStyles: React.CSSProperties = {};
    
    Object.keys(styles).forEach(key => {
      const value = (styles as any)[key];
      if (value !== undefined) {
        // Handle camelCase conversion for React styles
        const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        (reactStyles as any)[camelKey] = value;
      }
    });
    
    return reactStyles;
  };

  const reactStyles = getReactStyles();

  switch (component.type) {
    case 'container':
      return (
        <div style={reactStyles} className="w-full">
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
        <div style={{ ...reactStyles, display: 'flex' }} className="w-full">
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
        <div style={reactStyles} className="flex-1">
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
            style={reactStyles}
            autoFocus
          />
        );
      }

      return (
        <div
          style={reactStyles}
          onDoubleClick={() => handleDoubleClick('text', textContent)}
          dangerouslySetInnerHTML={{ __html: processMergeTags(textContent) }}
        />
      );

    case 'heading':
      const headingText = component.content?.text || component.content?.title || 'Your Heading';
      
      return (
        <div style={reactStyles}>
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
        <div style={reactStyles}>
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
      const btnText = component.content?.text || 'Click Here';
      const btnHref = component.content?.href || '#';

      return (
        <div style={{ textAlign: reactStyles.textAlign as any, padding: reactStyles.padding }}>
          <a
            href={btnHref}
            style={{
              ...reactStyles,
              display: 'inline-block',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onDoubleClick={() => handleDoubleClick('text', btnText)}
          >
            {processMergeTags(btnText)}
          </a>
        </div>
      );

    case 'divider':
      return (
        <hr
          style={{
            ...reactStyles,
            border: 'none',
            margin: reactStyles.margin || '16px 0'
          }}
        />
      );

    case 'spacer':
      return <div style={reactStyles} />;

    case 'social':
      const socialItems = component.content?.items || [];
      
      return (
        <div style={reactStyles}>
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
        <div style={reactStyles}>
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
          style={reactStyles}
          dangerouslySetInnerHTML={{ __html: component.content?.html || '<p>Custom HTML content</p>' }}
        />
      );

    case 'timer':
    case 'countdown':
      return (
        <div style={reactStyles}>
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
        <div style={reactStyles}>
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
        <div style={reactStyles}>
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
        <div style={reactStyles}>
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
        <div style={reactStyles}>
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
      const formFields = component.content?.fields || [
        { id: 'name', type: 'text', label: 'Your Name', placeholder: 'Enter your name', required: true },
        { id: 'email', type: 'email', label: 'Your Email', placeholder: 'Enter your email', required: true }
      ];
      const formTitle = component.content?.title || 'Contact Form';
      const formButtonText = component.content?.buttonText || 'Submit';

      return (
        <div style={reactStyles}>
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4" 
                onDoubleClick={() => handleDoubleClick('title', formTitle)}>
              {processMergeTags(formTitle)}
            </h3>
            
            {formFields.map((field: any) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={field.rows || 4}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <select className="w-full p-2 border border-gray-300 rounded-md text-sm" required={field.required}>
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((option: any) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="text-sm"
                  />
                )}
              </div>
            ))}
            
            <Button 
              className="w-full mt-4"
              onDoubleClick={() => handleDoubleClick('buttonText', formButtonText)}
            >
              {processMergeTags(formButtonText)}
            </Button>
          </div>
        </div>
      );

    case 'survey':
      const surveyData = component.content?.surveyData || {
        title: 'Follow Up Survey Form for Campaign',
        questions: [
          {
            id: '1',
            type: 'rating',
            question: 'Overall, how satisfied are you with the campaign presented?',
            required: true,
            options: {
              scale: 5,
              labels: { min: 'Unsatisfied', max: 'Very satisfied' }
            }
          },
          {
            id: '2',
            type: 'radio',
            question: 'Did our campaign meet your expectations?',
            required: true,
            options: {
              choices: ['Yes', 'No']
            }
          },
          {
            id: '3',
            type: 'radio',
            question: 'Have you learnt anything new from our campaign?',
            required: false,
            options: {
              choices: ['Yes', 'No']
            }
          },
          {
            id: '4',
            type: 'checkbox',
            question: 'What aspect of the product or service were you most satisfied by?',
            required: false,
            options: {
              choices: ['Quality', 'Design', 'Information', 'Campaigners', 'Other']
            }
          },
          {
            id: '5',
            type: 'checkbox',
            question: 'What aspect of the product or service were you least satisfied by?',
            required: false,
            options: {
              choices: ['Quality', 'Design', 'Information', 'Campaigners', 'Other']
            }
          },
          {
            id: '6',
            type: 'textarea',
            question: 'Please explain why:',
            required: false,
            placeholder: 'Your feedback...'
          },
          {
            id: '7',
            type: 'radio',
            question: 'Could we improve on anything for our campaign?',
            required: false,
            options: {
              choices: ['Yes', 'No']
            }
          }
        ],
        submitButton: {
          text: 'Submit',
          backgroundColor: '#22c55e',
          textColor: '#ffffff'
        }
      };

      return (
        <div style={reactStyles}>
          <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-gray-100 text-center">
              {surveyData.title}
            </h2>
            
            <form className="space-y-8">
              {surveyData.questions.map((question: any, index: number) => (
                <div key={question.id} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {question.type === 'rating' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        {Array.from({ length: question.options.scale }, (_, i) => (
                          <label key={i + 1} className="flex flex-col items-center space-y-2">
                            <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                              <input 
                                type="radio" 
                                name={`question-${question.id}`} 
                                value={i + 1}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{i + 1}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{question.options.labels.min}</span>
                        <span>{question.options.labels.max}</span>
                      </div>
                    </div>
                  )}
                  
                  {question.type === 'radio' && (
                    <div className="space-y-2">
                      {question.options.choices.map((choice: string, choiceIndex: number) => (
                        <label key={choiceIndex} className="flex items-center space-x-3">
                          <input 
                            type="radio" 
                            name={`question-${question.id}`} 
                            value={choice}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{choice}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'checkbox' && (
                    <div className="space-y-2">
                      {question.options.choices.map((choice: string, choiceIndex: number) => (
                        <label key={choiceIndex} className="flex items-center space-x-3">
                          <input 
                            type="checkbox" 
                            name={`question-${question.id}[]`} 
                            value={choice}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{choice}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'textarea' && (
                    <textarea 
                      name={`question-${question.id}`}
                      rows={4}
                      placeholder={question.placeholder || 'Your answer...'}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  )}
                </div>
              ))}
              
              <div className="pt-4">
                <button
                  type="submit"
                  style={{
                    backgroundColor: surveyData.submitButton.backgroundColor,
                    color: surveyData.submitButton.textColor
                  }}
                  className="px-8 py-3 rounded-md font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {surveyData.submitButton.text}
                </button>
              </div>
            </form>
          </div>
        </div>
      );

    case 'game':
      return (
        <div style={reactStyles}>
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Interactive Quiz</h3>
            <p className="mb-4">Test your knowledge and win prizes!</p>
            <div className="bg-white text-gray-900 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Question 1 of 5</p>
              <p className="mb-3">What is the capital of France?</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded">Paris</button>
                <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded">London</button>
                <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded">Madrid</button>
                <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded">Berlin</button>
              </div>
            </div>
            <Button>Start Quiz</Button>
          </div>
        </div>
      );

    case 'amp-carousel':
      return (
        <div style={reactStyles}>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div className="flex">
              <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center text-white">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Slide 1</h3>
                  <p>Interactive AMP Carousel</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      );

    case 'amp-form':
      return (
        <div style={reactStyles}>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h3 className="font-semibold mb-3">AMP Interactive Form</h3>
            <div className="space-y-3">
              <Input placeholder="Real-time validation" />
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Select an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <Button className="w-full">Submit with AMP</Button>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div style={reactStyles} className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          <p>Unknown component type: {component.type}</p>
          <p className="text-xs mt-1">Component ID: {component.id}</p>
        </div>
      );
  }
}