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
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../services/notification/notification.service';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuizPage {
  isLoading = false;
  inputText = '';
  characterCount = 0;
  hasQuestions = false;
  questions: QuizQuestion[] = [];
  selectedAnswers: { [key: number]: number } = {};

  private readonly GENERATE_QUIZ_URL = 'https://us-central1-prompt-backend-2025-v1.cloudfunctions.net/generateQuiz';

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
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
      await this.notificationService.showToast('Please enter a topic or text to generate a quiz', 'warning');
      return;
    }

    this.isLoading = true;
    this.hasQuestions = false;
    this.questions = [];
    this.selectedAnswers = {};
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      const response: any = await this.http.post<any>(
        this.GENERATE_QUIZ_URL,
        { input: this.inputText },
        { headers }
      ).toPromise();
      if (response && Array.isArray(response.quiz)) {
        this.questions = response.quiz;
        this.hasQuestions = true;
        await this.notificationService.showToast('Quiz generated successfully!', 'success');
      } else {
        await this.notificationService.showToast('Quiz response was empty or malformed.', 'error');
      }
    } catch (error: any) {
      await this.notificationService.showToast('Failed to generate quiz. Please try again.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async onAnswerSelect(questionId: number, answerIndex: number) {
    this.selectedAnswers[questionId] = answerIndex;
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return;
    if (answerIndex === question.correctAnswerIndex) {
      await this.notificationService.showToast('Correct answer!', 'success');
    } else {
      await this.notificationService.showToast('Wrong answer. Try again!', 'error');
    }
  }
} 