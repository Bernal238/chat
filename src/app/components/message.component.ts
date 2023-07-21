import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  standalone: true, //NO NECESITAN SER DECLARADOS EN UN MODULO, SOLO SE IMPORTA DONDE LO OCUPEMOS
  imports: [CommonModule]
})
export class MessageComponent{

  @Input() messagePosition: 'left' | 'right' = 'right';
  @Input() message: string = '';
  @Input() profileImage?: string;

  private _messageDate!: Date;

  @Input()
  set messageDate(date: Timestamp | Date){
    if(date instanceof Timestamp){
      this._messageDate = date.toDate();
    }else{
      this._messageDate = date;
    }
  }

  get messageDate(): Date{
    return this.messageDate;
  }


}
