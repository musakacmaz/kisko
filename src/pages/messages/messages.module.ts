import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';
import { EmojiProvider } from "../../providers/user/emoji";
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";

@NgModule({
  declarations: [
    MessagesPage,
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(MessagesPage),
  ],
  providers:[
    EmojiProvider
  ]
})
export class MessagesPageModule {}
