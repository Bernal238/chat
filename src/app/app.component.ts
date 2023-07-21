import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from './interfaces/user.interface';
import { UserService } from './services/user.service';
import { Firestore, collection, addDoc, DocumentReference, query, collectionData} from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore'
import { tap } from 'rxjs/operators';
import { IMessage } from './interfaces/message.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('chatContent') chatContent!: ElementRef; //Obtener un solo elemento
  // @ViewChildren //Obtener todos los elementos
  title = 'chat';
  user?: IUser | null = null;
  message: string = '';
  private firestore: Firestore = inject(Firestore);
  private messageCollection = collection(this.firestore, 'messages');
  chatMessages$: Observable<IMessage[]>;


  /*OBSERVABLE
  ESTADOS:
  FINALIZO
  FINALIZO CON ERROR

  EVENTLOOP
  */

  constructor(private userService: UserService){
    this.user = this.userService.getUser();
    this.chatMessages$ =
    collectionData(query(this.messageCollection, orderBy('date') )).pipe(tap((messages: any) => {
      setTimeout(() => {
        // const container = this.chatContent.nativeElement;
        // container.scrollTop = container.scrollHeight;//Scroll automatico
      });
    })) as Observable<IMessage[]>;
    console.log(this.chatMessages$);

  }

  formUser: FormGroup = new FormGroup({//FORMULARIO
    id: new FormControl('', [Validators.required]),//inicializar, arreglo de validadores[ Validators.minLength(3)]
    name: new FormControl('', [Validators.required]),
    profileImage: new FormControl('', [Validators.required])
  })

  saveProfile(){
    // console.log(this.formUser.controls['name'].value);
    // console.log(this.formUser.valid);
    // console.log(this.formUser.getRawValue());
    this.formUser.markAsDirty();
    if(this.formUser.valid){
      this.userService.saveUser(this.formUser.getRawValue());
      this.user = this.userService.getUser();
    }
  }

  sendMessage(){
    if(!this.sendMessage || !this.user){
      return;
    }
    const newMessage: IMessage = {
      userId: this.user.id,
      userName: this.user.name,
      message: this.message,
      profileImage: this.user.profileImage,
      date: new Date()
    };
    this.message = '';
    addDoc(this.messageCollection, newMessage)
    .then((DocumentReference: DocumentReference) => {})
    .catch((error) => {});
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent){
    if(event.code === 'Enter'){
      this.sendMessage();
    }
  }

}
