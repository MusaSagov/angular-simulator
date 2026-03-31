import { Injectable } from "@angular/core";
import { IToastMessage } from "../interfaces/IToastMessage";
import { MessageType } from "../enums/MessageType";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ToastService {

  private toasts: IToastMessage[] = [];

  private toastsSubject: BehaviorSubject<IToastMessage[]> = new BehaviorSubject<IToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable()

  getMessages(): IToastMessage[] {
    return [...this.toasts];
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
    const messageList: IToastMessage[] = this.toastsSubject.getValue();
    this.toastsSubject.next([message, ...messageList]);
    setTimeout(() => this.closeMessage(message.id), 5000);
  }

  closeMessage(id: string): void {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter((msg: IToastMessage) => msg.id !== id));
  }
  
}