import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonTextarea, IonButton, IonIcon, IonLoading } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  send, 
  chatbubbleEllipses, 
  settingsOutline, 
  personCircleOutline,
  sparklesOutline 
} from 'ionicons/icons';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../services/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//Firebase function URL
const ASK_GPT_FUNCTION_URL = "https://us-central1-prompt-backend-2025-v1.cloudfunctions.net/askGPT";

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [
    IonLoading,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonTextarea,
    IonButton,
    IonIcon,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
})

export class ChatPage {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  //Properties to managme Chat state
  isLoading: boolean = false;
  inputText: string = '';
  messages: {text: string; sender: 'user' | 'ai'}[] = []

  constructor(
    private httpclient: HttpClient,
    private notificationService : NotificationService
  ) {
    addIcons({ 
      send, 
      chatbubbleEllipses, 
      settingsOutline, 
      personCircleOutline,
      sparklesOutline 
    });
  }

  async sendMessage() {
    const userPrompt = this.inputText.trim();

    if(!userPrompt){
      await this.notificationService.showToast('Please type a message to send.', 'warning');
      return;
    }

    this.messages.push({text: userPrompt, sender: 'user'});
    this.inputText = '';
    this.isLoading = true;

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      const response = await this.httpclient.post<{ response: string}>(
        ASK_GPT_FUNCTION_URL, 
        { prompt: userPrompt },
        { headers }
      ).toPromise();

      if (response && response.response){
        this.messages.push({ text: response.response, sender: 'ai'});
      } else {
        await this.notificationService.showToast('AI response was empty or malformed.', 'error');
      }
      
    } catch (error: any) {
      console.error('Error calling askGPT Firebase Function:', error);
      let errorMessage = 'Failed to get response from AI. ';
      
      if (error.status === 500) {
        errorMessage += 'Server error occurred. Please try again later.';
      } else if (error.status === 404) {
        errorMessage += 'Service not found. Please check the API endpoint.';
      } else if (error.status === 403) {
        errorMessage += 'Access denied. Please check your permissions.';
      }
      
      await this.notificationService.showToast(errorMessage, 'error');
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  private scrollToBottom(){
    setTimeout(() => {
      if(this.messageContainer && this.messageContainer.nativeElement){
        const scrollElement = this.messageContainer.nativeElement.querySelector('ion-content');
        if (scrollElement){
          scrollElement.scrollToBottom(300);
        }
      }
    }, 100)
  }
}

