import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../Services/users.service';
import Instrument from '../../../Models/Instrument';
import { InstrumentsService } from '../../../Services/instrument.service';
import Teacher from '../../../Models/Teacher';

@Component({
  selector: 'app-teacher-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './teacher-signup.component.html',
  styleUrls: ['./teacher-signup.component.css']
})


export class TeacherSignupComponent implements OnInit {

  userId: number | null = null;
  instrumentsList: Instrument[] = [];
  message: string = '';
  showMessageBox: boolean = false;

  teacherData: Teacher = {
    pricePerLesson: 0,
    experience: 0,
    lessonDuration: 60,
    instrumentsIds: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private instrumentsService: InstrumentsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (!this.userId) {
        this.router.navigate(['/profile']);
      }
    });

    this.loadInstruments();
  }

  loadInstruments(): void {
    this.instrumentsService.getInstruments().subscribe({
      next: (instrumentsIds: Instrument[]) => {
        this.instrumentsList = instrumentsIds;
      },
      error: (err: any) => {
        console.error('Error loading instruments:', err);
      }
    });
  }


  toggleInstrument(instrumentId: number): void {
    if (!instrumentId) return;

    const instrumentsArray = this.teacherData.instrumentsIds || [];
    const index = instrumentsArray.indexOf(instrumentId);

    if (index > -1) {
      instrumentsArray.splice(index, 1);
    } else {
      instrumentsArray.push(instrumentId);
    }
    this.teacherData.instrumentsIds = instrumentsArray;
  }

  onSubmit(): void {
    if (!this.userId) return;

    if ((this.teacherData.instrumentsIds || []).length === 0) {
      return;
    }

    this.usersService.signUpAsTeacher(this.userId, this.teacherData).subscribe({
      next: (res) => {
        this.showMessage('Congratulations! You have successfully joined as a music teacher!');
        this.router.navigate(['/profile', this.userId]);
      },
      error: (err) => {
        console.error('Teacher signup failed:', err);
        this.showMessage(`Teacher registration failed. Please check your details. Error: ${err.error || err.message}`);
      }
    });
  }

  showMessage(msg: string) {
    this.message = msg;
    this.showMessageBox = true;
    setTimeout(() => this.showMessageBox = false, 5000);
  }
}