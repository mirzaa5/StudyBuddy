import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  helpCircleOutline, 
  createOutline, 
  settingsOutline, 
  sparklesOutline 
} from 'ionicons/icons';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuizPage {
  isLoading = false;
  inputText = '';
  characterCount = 0;
  hasQuestions = false;
  questions: QuizQuestion[] = [];
  selectedAnswers: { [key: number]: number } = {};

  constructor(private toastController: ToastController) {
    addIcons({ 
      helpCircleOutline, 
      createOutline, 
      settingsOutline, 
      sparklesOutline 
    });
  }

  onTextChange(event: any) {
    this.inputText = event.detail.value;
    this.characterCount = this.inputText.length;
  }

  async generateQuiz() {
    if (!this.inputText.trim()) {
      await this.showToast('Please enter a topic or text to generate a quiz', 'warning');
      return;
    }

    this.isLoading = true;
    try {
      // TODO: Implement actual quiz generation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      
      // Sample quiz data
      this.questions = [
        {
          id: 1,
          question: 'What is the capital of France?',
          options: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctAnswer: 1
        },
        {
          id: 2,
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 1
        }
      ];
      
      this.hasQuestions = true;
      await this.showToast('Quiz generated successfully!', 'success');
    } catch (error) {
      await this.showToast('Failed to generate quiz. Please try again.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  onAnswerSelect(questionId: number, answerIndex: number) {
    this.selectedAnswers[questionId] = answerIndex;
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