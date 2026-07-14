import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateLeft, faComment, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  private chatService = inject(ChatService);

  icons = { faComment, faArrowRotateLeft, faXmark, faPaperPlane };

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  draft = signal('');
  isSending = signal(false);
  width = signal(420);
  height = signal(580);

  private messagesContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');
  private sessionId = crypto.randomUUID();

  private resizing = false;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeStartWidth = 0;
  private resizeStartHeight = 0;

  constructor() {
    this.seedWelcomeMessage();
    effect(() => {
      this.messages();
      queueMicrotask(() => this.scrollToBottom());
    });
  }

  toggleOpen() {
    this.isOpen.set(!this.isOpen());
  }

  sendMessage(text?: string) {
    const message = (text ?? this.draft()).trim();
    if (!message || this.isSending()) return;

    this.pushMessage({ id: crypto.randomUUID(), sender: 'user', text: message });
    this.draft.set('');
    this.isSending.set(true);

    this.chatService.sendMessage(this.sessionId, message).subscribe({
      next: (response) => {
        const hasText = !!response.text?.trim();
        const hasRichContent = !!response.richContent?.length;
        this.pushMessage({
          id: crypto.randomUUID(),
          sender: 'bot',
          text: hasText || hasRichContent ? response.text : 'Lo siento, no he entendido tu mensaje. ¿Puedes reformularlo?',
          richContent: response.richContent,
        });
        this.isSending.set(false);
      },
      error: () => {
        this.pushMessage({
          id: crypto.randomUUID(),
          sender: 'bot',
          text: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Inténtalo de nuevo.',
        });
        this.isSending.set(false);
      },
    });
  }

  onChipClick(text: string) {
    this.sendMessage(text);
  }

  resetConversation() {
    this.messages.set([]);
    this.draft.set('');
    this.sessionId = crypto.randomUUID();
    this.seedWelcomeMessage();
  }

  private seedWelcomeMessage() {
    this.pushMessage({ id: crypto.randomUUID(), sender: 'bot', text: '¡Hola! Soy tu asistente de enfermería. ¿En qué puedo ayudarte?' });
  }

  private pushMessage(message: ChatMessage) {
    this.messages.set([...this.messages(), message]);
  }

  private scrollToBottom() {
    const el = this.messagesContainer()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  onResizeStart(event: PointerEvent) {
    event.preventDefault();
    this.resizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    this.resizeStartWidth = this.width();
    this.resizeStartHeight = this.height();
    window.addEventListener('pointermove', this.onResizeMove);
    window.addEventListener('pointerup', this.onResizeEnd);
  }

  private onResizeMove = (event: PointerEvent) => {
    if (!this.resizing) return;
    const deltaX = this.resizeStartX - event.clientX;
    const deltaY = this.resizeStartY - event.clientY;
    this.width.set(this.clamp(this.resizeStartWidth + deltaX, 320, 800));
    this.height.set(this.clamp(this.resizeStartHeight + deltaY, 400, 900));
  };

  private onResizeEnd = () => {
    this.resizing = false;
    window.removeEventListener('pointermove', this.onResizeMove);
    window.removeEventListener('pointerup', this.onResizeEnd);
  };

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}
