// Core Stripo Types

export interface StripoUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline?: boolean;
  cursor?: {
    x: number;
    y: number;
    componentId?: string;
  };
}

export interface StripoEmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  components: StripoComponent[];
  globalStyles: StripoGlobalStyles;
  settings: StripoTemplateSettings;
  metadata: StripoTemplateMetadata;
  created: string;
  lastModified: string;
  createdBy: string;
  modifiedBy: string;
  version: number;
  tags?: string[];
  category?: string;
  thumbnail?: string;
  isFavorite?: boolean;
}

export interface StripoComponent {
  id: string;
  type: StripoComponentType;
  name?: string;
  locked?: boolean;
  hidden?: boolean;
  content?: StripoComponentContent;
  styles: StripoComponentStyles;
  settings: StripoComponentSettings;
  children?: StripoComponent[];
  parent?: string;
  order: number;
  conditions?: StripoDisplayCondition[];
  interactions?: StripoInteraction[];
  tracking?: StripoTracking;
}

export type StripoComponentType = 
  | 'container'
  | 'row'
  | 'column'
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'social'
  | 'video'
  | 'html'
  | 'timer'
  | 'product'
  | 'rss'
  | 'header'
  | 'footer'
  | 'navigation'
  | 'hero'
  | 'testimonial'
  | 'pricing'
  | 'gallery'
  | 'form'
  | 'survey'
  | 'game'
  | 'amp-carousel'
  | 'amp-accordion'
  | 'amp-form'
  | 'amp-list'
  | 'amp-image'
  | 'amp-bind'
  | 'custom';

export interface StripoComponentContent {
  text?: string;
  html?: string;
  src?: string;
  alt?: string;
  href?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items?: StripoContentItem[];
  variables?: StripoVariable[];
  dynamicContent?: StripoDynamicContent;
}

export interface StripoContentItem {
  id: string;
  type: string;
  content: any;
  styles?: Partial<StripoComponentStyles>;
}

export interface StripoVariable {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'url' | 'image' | 'boolean';
  defaultValue?: any;
  required?: boolean;
  description?: string;
  validation?: StripoValidation;
}

export interface StripoValidation {
  pattern?: string;
  min?: number;
  max?: number;
  required?: boolean;
  custom?: string;
}

export interface StripoDynamicContent {
  source: 'api' | 'rss' | 'manual';
  endpoint?: string;
  mapping?: Record<string, string>;
  filters?: StripoContentFilter[];
  sorting?: StripoContentSort[];
  limit?: number;
}

export interface StripoContentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'in' | 'not_in';
  value: any;
}

export interface StripoContentSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface StripoComponentStyles {
  // Layout
  display?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  
  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  textTransform?: string;
  color?: string;
  
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  
  // Border
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  
  // Effects
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  filter?: string;
  
  // Flexbox
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  flex?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  gap?: string;
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  gridColumn?: string;
  gridRow?: string;
  
  // Responsive
  mobileStyles?: Partial<StripoComponentStyles>;
  tabletStyles?: Partial<StripoComponentStyles>;
  
  // Custom
  customCSS?: string;
}

export interface StripoComponentSettings {
  // Visibility
  visible?: boolean;
  hiddenOnMobile?: boolean;
  hiddenOnDesktop?: boolean;
  
  // Responsive
  mobileVisible?: boolean;
  tabletVisible?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  altText?: string;
  title?: string;
  
  // SEO
  nofollow?: boolean;
  noindex?: boolean;
  
  // Tracking
  trackingId?: string;
  analyticsEvent?: string;
  
  // Personalization
  showIf?: StripoCondition[];
  hideIf?: StripoCondition[];
  
  // Content
  autoHeight?: boolean;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  
  // Animation
  animation?: StripoAnimation;
  
  // AMP specific
  ampAttributes?: Record<string, any>;
  ampValidation?: boolean;
}

export interface StripoCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater' | 'less' | 'in' | 'not_in';
  value: any;
}

export interface StripoAnimation {
  type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'bounce' | 'shake' | 'pulse' | 'none';
  duration?: string;
  delay?: string;
  timing?: string;
  iteration?: string;
}

export interface StripoDisplayCondition {
  id: string;
  name: string;
  field: string;
  operator: string;
  value: any;
  logic?: 'and' | 'or';
}

export interface StripoInteraction {
  id: string;
  trigger: 'click' | 'hover' | 'focus' | 'scroll' | 'load';
  action: 'show' | 'hide' | 'toggle' | 'animate' | 'redirect' | 'submit' | 'custom';
  target?: string;
  parameters?: Record<string, any>;
}

export interface StripoTracking {
  analytics?: {
    google?: string;
    facebook?: string;
    custom?: Record<string, string>;
  };
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export interface StripoGlobalStyles {
  container: {
    maxWidth: string;
    backgroundColor: string;
    fontFamily: string;
    lineHeight: string;
    padding: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    link: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    h1Size: string;
    h2Size: string;
    h3Size: string;
    bodySize: string;
    smallSize: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  responsive: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  customCSS?: string;
}

export interface StripoTemplateSettings {
  width: number;
  backgroundColor: string;
  contentAreaBackgroundColor: string;
  direction: 'ltr' | 'rtl';
  language: string;
  preheaderText?: string;
  
  // Email client compatibility
  outlookCompatibility: boolean;
  appleMail: boolean;
  gmail: boolean;
  yahooMail: boolean;
  
  // Features
  darkModeSupport: boolean;
  ampSupport: boolean;
  interactiveElements: boolean;
  
  // Tracking
  openTracking: boolean;
  clickTracking: boolean;
  unsubscribeLink: boolean;
  
  // Personalization
  mergeTags: StripoVariable[];
  dynamicContent: boolean;
  conditionalContent: boolean;
}

export interface StripoTemplateMetadata {
  description?: string;
  industry?: string;
  purpose?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number;
  components: number;
  size: number;
  lastExported?: string;
  exportFormat?: 'html' | 'amp' | 'both';
  version: string;
  changelog?: StripoChange[];
}

export interface StripoChange {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  type: 'component_add' | 'component_remove' | 'component_update' | 'style_change' | 'content_change' | 'template_settings';
  description: string;
  componentId?: string;
  data?: any;
}

export interface StripoTemplate {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  thumbnail: string;
  previewImages: string[];
  description: string;
  tags: string[];
  industry: string[];
  purpose: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  isFree: boolean;
  isNew: boolean;
  isPopular: boolean;
  rating: number;
  downloads: number;
  components: number;
  template: StripoEmailTemplate;
  created: string;
  updated: string;
}

export interface StripoTemplateCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: StripoTemplateSubcategory[];
  templateCount: number;
}

export interface StripoTemplateSubcategory {
  id: string;
  name: string;
  templateCount: number;
}

export interface StripoComment {
  id: string;
  componentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  replies?: StripoCommentReply[];
  position?: {
    x: number;
    y: number;
  };
}

export interface StripoCommentReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
}

export interface StripoCollaborationEvent {
  type: 'user_join' | 'user_leave' | 'cursor_move' | 'component_select' | 'component_update' | 'comment_add' | 'comment_resolve';
  userId: string;
  data?: any;
  timestamp: string;
}

export interface StripoVersionHistoryEntry {
  id: string;
  template: StripoEmailTemplate;
  timestamp: string;
  userId: string;
  userName: string;
  description: string;
  changes: StripoChange[];
  isAutoSave: boolean;
}

export interface StripoExportOptions {
  format: 'html' | 'amp';
  minify: boolean;
  inlineCSS: boolean;
  removeComments: boolean;
  optimizeImages: boolean;
  includeDarkMode: boolean;
  includePreheader: boolean;
  targetESP?: string;
  customSettings?: Record<string, any>;
}

export interface StripoAIAssistant {
  generateContent: (prompt: string, componentType: StripoComponentType) => Promise<string>;
  suggestImprovements: (template: StripoEmailTemplate) => Promise<string[]>;
  optimizeSubject: (subject: string, industry?: string) => Promise<string[]>;
  generateAltText: (imageUrl: string) => Promise<string>;
  translateContent: (content: string, targetLanguage: string) => Promise<string>;
  analyzeSentiment: (content: string) => Promise<'positive' | 'neutral' | 'negative'>;
}

export interface StripoGameElement {
  id: string;
  type: 'quiz' | 'survey' | 'scratch' | 'wheel' | 'memory' | 'puzzle';
  title: string;
  description: string;
  config: StripoGameConfig;
  prizes?: StripoPrize[];
  analytics?: StripoGameAnalytics;
}

export interface StripoGameConfig {
  questions?: StripoQuizQuestion[];
  options?: StripoGameOption[];
  rules?: string[];
  timeLimit?: number;
  attempts?: number;
  winCondition?: string;
  styles?: StripoComponentStyles;
}

export interface StripoQuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text' | 'rating';
  options?: string[];
  correctAnswer?: string | string[];
  points?: number;
}

export interface StripoGameOption {
  id: string;
  label: string;
  value: any;
  image?: string;
  weight?: number;
}

export interface StripoPrize {
  id: string;
  name: string;
  description: string;
  image?: string;
  value?: string;
  probability?: number;
  redeemCode?: string;
}

export interface StripoGameAnalytics {
  plays: number;
  completions: number;
  averageTime: number;
  conversionRate: number;
  popularAnswers?: Record<string, number>;
}

// Event types for real-time collaboration
export interface StripoRealtimeEvent {
  type: string;
  userId: string;
  data: any;
  timestamp: number;
}

// Integration types
export interface StripoIntegration {
  id: string;
  name: string;
  type: 'esp' | 'crm' | 'analytics' | 'storage' | 'cdn';
  config: Record<string, any>;
  enabled: boolean;
}

// Plugin system types
export interface StripoPlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  components?: StripoComponentType[];
  hooks?: StripoPluginHook[];
  settings?: StripoPluginSetting[];
}

export interface StripoPluginHook {
  name: string;
  callback: Function;
  priority?: number;
}

export interface StripoPluginSetting {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
}