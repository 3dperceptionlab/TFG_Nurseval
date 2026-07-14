export interface ChatRichContentBlock {
  type: 'image' | 'info' | 'description' | 'divider' | 'chips';
  rawUrl?: string;
  title?: string;
  subtitle?: string;
  text?: string[];
  options?: { text: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  richContent?: ChatRichContentBlock[];
}

export interface ChatMessageResponse {
  text?: string;
  richContent?: ChatRichContentBlock[];
}
