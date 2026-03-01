import { Injectable } from "@angular/core";
import { IToastMessage } from "./interfaces";
import { MessageType } from "./enums/MessageType";

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages: IToastMessage[] = [];

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
    this.messages = [message, ...this.messages];

    setTimeout(() => this.closeMessage(message), 5000);
  }

  closeMessage(message: IToastMessage): void {
    this.messages = this.messages.filter((msg: IToastMessage) => msg !== message);
  }
}