import { Injectable } from "@angular/core";
import { IToastMessage } from "./interfaces";
import { MessageType } from "./enums/MessageType";

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages: IToastMessage[] = [];
  
  getMessages(): readonly IToastMessage[] {
    return this.messages;
  }

  addMessage(text: string, type: MessageType = MessageType.INFO): void {
    const message: IToastMessage = {
      id: Date.now().toString(),
      text,
      type
    };
    this.messages.unshift(message);

    setTimeout(() => this.closeMessage(message), 5000);
  }

  closeMessage(message: IToastMessage): void {
    this.messages = this.messages.filter(msg => msg !== message);
  }
}
