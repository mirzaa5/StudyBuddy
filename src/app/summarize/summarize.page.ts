import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  documentTextOutline, 
  createOutline, 
  settingsOutline, 
  sparklesOutline 
} from 'ionicons/icons';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-summarize',
  templateUrl: './summarize.page.html',
  styleUrls: ['./summarize.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SummarizePage {
  isLoading = false;
  inputText = '';
  summary = '';
  characterCount = 0;

  constructor(
    private toastController: ToastController
  ) {
    addIcons({ 
      documentTextOutline, 
      createOutline, 
      settingsOutline, 
      sparklesOutline 
    });
  }

  onTextChange(event: any) {
    this.inputText = event.detail.value;
    this.characterCount = this.inputText.length;
  }

  async summarize() {
    if (!this.inputText.trim()) {
      await this.showToast('Please enter some text to summarize', 'warning');
      return;
    }

    this.isLoading = true;
    this.summary = '';
    try {
      
      const response = await fetch('https://us-central1-prompt-backend-2025-v1.cloudfunctions.net/summarizeNotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: this.inputText })
      });
      if (!response.ok) {
        throw new Error('Failed to generate summary.');
      }
      const data = await response.json();
      this.summary = data.summary;
      await this.showToast('Summary generated successfully!', 'success');
    } catch (error) {
      await this.showToast('Failed to generate summary. Please try again.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  private async showToast(message: string, type: 'success' | 'error' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: type === 'success' ? 'success' : type === 'error' ? 'danger' : 'warning',
      buttons: [{
        text: 'Dismiss',
        role: 'cancel'
      }]
    });
    await toast.present();
  }
} 