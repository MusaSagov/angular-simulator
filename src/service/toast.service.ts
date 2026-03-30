import { Injectable } from "@angular/core";
import { IToastMessage } from "../interfaces/IToastMessage";
import { MessageType } from "../enums/MessageType";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages: IToastMessage[] = [];

  private messagesSubject: BehaviorSubject<IToastMessage[]> = new BehaviorSubject<IToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable()

  getMessages(): IToastMessage[] {
    return [...this.messages];
  }

  showSuccess(message: string): void {
    this.addMessage(message, MessageType.SUCCESS);
  }

  showError(message: string): void {
    this.addMessage(message, MessageType.ERROR);
  }

  showInfo(message: string): void {
    this.addMessage(message, MessageType.INFO);
  }

  showWarning(message: string): void {
    this.addMessage(message, MessageType.WARN);
  }

  addMessage(text: string, type: MessageType = MessageType.INFO): void {
    const message: IToastMessage = {
      id: Date.now().toString(),
      text,
      type
    };
    const messageList: IToastMessage[] = this.messagesSubject.getValue();
    this.messagesSubject.next([message, ...messageList]);
    setTimeout(() => this.closeMessage(message.id), 5000);
  }

  closeMessage(id: string): void {
    const current = this.messagesSubject.getValue();
    this.messagesSubject.next(current.filter((msg: IToastMessage) => msg.id !== id));
  }
}