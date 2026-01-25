import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Users, { EUserType } from '../../../Models/Users';
import { UsersService } from '../../../Services/users.service';
import { UserStateService } from '../../../Services/user-state.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from "../../../Pipes/highlight.pipe";
import { NoResultsComponent } from "../../Shared/no-results/no-results.component";
import { StatsCounterComponent } from "../../Shared/stats-counter/stats-counter.component";

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [RouterModule, FormsModule, HighlightPipe, MatIconModule, NoResultsComponent, StatsCounterComponent],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.css'
})

export class TeacherListComponent implements OnInit {

  public users: Users[] = [];
  public isShowDetails: boolean = false;
  public selectedUser!: Users;
  public showFilters: boolean = false;
  public user!: Users;
  // public isTeacher: boolean = false;
  // public needsProfileUpdate: boolean = false;
  private currentUserId: number | null = null;

  instrumentsCount: number | 0 = 0;
  originalTeacherList: Users[] = [];
  searchText: string = '';
  selectedLessonDuration: number | 'All' = 'All';
  selectedExperience: number | 'All' = 'All';
  selectedInstrumentId: number | 'All' = 'All';
  selectedPrice: number | 'All' = 'All';
  lessonDurations: Array<number | 'All'> = ['All'];
  experiences: Array<number | 'All'> = ['All'];
  instruments: Array<{ id: number | 'All', name: string }> = [];
  prices: Array<number | 'All'> = ['All'];
  TeacherList: Users[] = [];
  cities: string[] = ['All'];
  countries: string[] = ['All'];
  createdYears: string[] = ['All'];
  selectedCity: string = 'All';
  selectedCountry: string = 'All';
  selectedCreatedYear: string = 'All';


  constructor(
    private router: Router,
    private _usersService: UsersService,
    public userStateService: UserStateService,
    public fileUtilsService: FileUtilsService,
    public navigationService: NavigationService,
  ) { }



  ngOnInit(): void {
    const currentUser = this.userStateService.getCurrentUserValue();

    if (!currentUser) {
      return;
    }

    this.currentUserId = currentUser.id;

    this.loadTeachers();

    // this._usersService.getUserById(this.currentUserId).subscribe({
    //   next: (fullUser) => {
    //     this.user = fullUser;

    //     const userTypes: EUserType[] = this.user.userTypes || [];
    //     this.isTeacher = userTypes.includes(EUserType.TEACHER);
    //     this.needsProfileUpdate = !this.user.city || !this.user.description;
    //   },
    //   error: (err) => console.error('Error loading current user:', err)
    // });
  }


  // loadCurrentUser(userId: number): void {
  //   this._usersService.getUserById(userId).subscribe({
  //     next: (currentUser: Users) => {
  //       this.user = currentUser;

  //       const userTypes: EUserType[] = this.user.userTypes || [];
  //       this.isTeacher = userTypes.includes(EUserType.TEACHER);
  //       this.needsProfileUpdate =
  //         !this.user.city ||
  //         !this.user.description;

  //       console.log("User loaded:", this.user);
  //     },
  //     error: (err) => {
  //       console.error("Error loading current user:", err);
  //     }
  //   });
  // }



  loadTeachers(): void {
    this._usersService.getUsersByUserType(EUserType.TEACHER).subscribe({
      next: (res) => {
        console.log(' from server:', res);
        console.log('Raw response:', res);
        res.forEach(u => console.log('Teacher for user', u.id, ':', u.teacher));


        this.users = res;

        this.originalTeacherList = res;

        this.extractTeachersFilterOptions(res);

        this.applyTeacherFilters();


      },
      error: (err) => {
        console.error('Error fetching teacher data:', err);
      }
    });
  }
  // joinTeacherNetwork(): void {
  //   if (this.isTeacher) {
  //     console.log('The user is already set as a teacher.');
  //     return;
  //   }

  //   if (this.needsProfileUpdate) {
  //     this.router.navigate(['/edit-profil-modal', this.currentUserId]);
  //   } else {
  //     const idToUse = this.user?.id ?? this.currentUserId;

  //     if (!idToUse) {
  //       console.error('Cannot find the user ID.');
  //       return;
  //     }

  //     if (!this.user) {
  //       this.user = { id: idToUse } as Users;
  //     }

  //     this.updateUserTypeToTeacher(idToUse);
  //   }
  // }

  // updateUserTypeToTeacher(userId: number): void {
  //   if (!userId) {
  //     console.error("User has no ID!");
  //     return;
  //   }

  //   if (this.isTeacher) {
  //     console.log('The user is already set as a teacher.');
  //     return;
  //   }

  //   this._usersService.updateUserType(userId, EUserType.TEACHER).subscribe({
  //     next: () => {
  //       this.isTeacher = true;
  //       alert('Welcome to the teachers network!');
  //       if (this.user) {
  //         const userTypes: EUserType[] = this.user.userTypes || [];

  //         if (!userTypes.includes(EUserType.TEACHER)) {
  //           userTypes.push(EUserType.TEACHER);
  //         }
  //         this.user.userTypes = [...userTypes];
  //       }

  //       this.loadTeachers();
  //     },
  //     error: (err) => {
  //       console.error('Error updating user type:', err);
  //       alert('Error updating profile. Try again later.');
  //     }
  //   });
  // }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  extractTeachersFilterOptions(teachers: Users[]): void {
    const citySet = new Set<string>();
    teachers.forEach(teachers => {
      if (teachers.city && teachers.city.trim() !== '') {
        citySet.add(teachers.city.trim());
      }
    });
    this.cities = ['All', ...Array.from(citySet).sort()];

    const countrySet = new Set<string>();
    teachers.forEach(teachers => {
      if (teachers.country && teachers.country.trim() !== '') {
        countrySet.add(teachers.country.trim());
      }
    });
    this.countries = ['All', ...Array.from(countrySet).sort()];

    const durationSet = new Set<number>();
    teachers.forEach(u => {
      if (u.teacher?.lessonDuration) durationSet.add(u.teacher.lessonDuration);
    });
    this.lessonDurations = ['All', ...Array.from(durationSet).sort((a, b) => a - b)];

    const experienceSet = new Set<number>();
    teachers.forEach(u => {
      if (u.teacher?.experience) experienceSet.add(u.teacher.experience);
    });
    this.experiences = ['All', ...Array.from(experienceSet).sort((a, b) => b - a)];

    const priceSet = new Set<number>();
    teachers.forEach(u => {
      if (u.teacher?.pricePerLesson) priceSet.add(u.teacher.pricePerLesson);
    });
    this.prices = ['All', ...Array.from(priceSet).sort((a, b) => a - b)];

    const instrumentMap = new Map<number, string>();
    teachers.forEach(u => {
      if (u.teacher?.instruments) {
        u.teacher.instruments.forEach(inst => {
          if (inst.id != null && inst.name != null && !instrumentMap.has(inst.id)) {
            instrumentMap.set(inst.id, inst.name);
          }
        });
      }
    });

    this.instrumentsCount = Array.from(instrumentMap.entries()).map(([id, name]) => ({ id, name })).length;

    this.instruments = [
      { id: 'All', name: 'All' },
      ...Array.from(instrumentMap.entries()).map(([id, name]) => ({ id, name }))
    ];

    const yearSet = new Set<number>();
    teachers.forEach(teachers => {
      if (teachers.createdAt) {
        try {
          const year = new Date(teachers.createdAt).getFullYear();
          if (!isNaN(year)) {
            yearSet.add(year);
          }
        } catch (e) {
          console.error("Failed to parse createdAt date:", teachers.createdAt);
        }
      }
    });

    this.createdYears = ['All', ...Array.from(yearSet).sort((a, b) => b - a).map(String)];
  }


  applyTeacherFilters(): void {
    let filteredList = this.originalTeacherList;

    if (this.selectedCity !== 'All' && this.selectedCity) {
      filteredList = filteredList.filter(teacher =>
        teacher.city?.trim() === this.selectedCity
      );
    }

    if (this.selectedCountry !== 'All' && this.selectedCountry) {
      filteredList = filteredList.filter(teacher =>
        teacher.country?.trim() === this.selectedCountry
      );
    }

    if (this.selectedLessonDuration !== 'All') {
      const targetDuration = Number(this.selectedLessonDuration);

      filteredList = filteredList.filter(u => u.teacher?.lessonDuration === targetDuration);
    }
    if (this.selectedExperience !== 'All') {
      const targetExperience = Number(this.selectedExperience);
      filteredList = filteredList.filter(u => u.teacher?.experience === targetExperience);
    }

    if (this.selectedPrice !== 'All') {
      const targetPrice = Number(this.selectedPrice);
      filteredList = filteredList.filter(u => u.teacher?.pricePerLesson === targetPrice);
    }

    if (this.selectedInstrumentId !== 'All') {
      const targetId = Number(this.selectedInstrumentId);
      filteredList = filteredList.filter(u =>
        u.teacher?.instruments?.some(inst => inst.id === targetId)
      );
    }
    if (this.selectedCreatedYear !== 'All' && this.selectedCreatedYear) {
      const targetYear = parseInt(this.selectedCreatedYear, 10);

      filteredList = filteredList.filter(teacher => {
        if (!teacher.createdAt) return false;

        try {
          const musicianYear = new Date(teacher.createdAt).getFullYear();
          return musicianYear === targetYear;
        } catch (e) {
          return false;
        }
      });
    }

    this.TeacherList = filteredList;
  }



  updateTeacherList(): void {
    let filtered = [...this.originalTeacherList];

    if (this.selectedCity && this.selectedCity !== 'All') {
      filtered = filtered.filter(t => t.city === this.selectedCity);
    }

    if (this.selectedCountry && this.selectedCountry !== 'All') {
      filtered = filtered.filter(t => t.country === this.selectedCountry);
    }

    if (this.selectedLessonDuration !== 'All') {
      filtered = filtered.filter(t => t.teacher?.lessonDuration === Number(this.selectedLessonDuration));
    }

    if (this.selectedExperience !== 'All') {
      filtered = filtered.filter(t => t.teacher?.experience === Number(this.selectedExperience));
    }

    if (this.selectedPrice !== 'All') {
      filtered = filtered.filter(t => t.teacher?.pricePerLesson === Number(this.selectedPrice));
    }

    if (this.selectedInstrumentId !== 'All') {
      const instrumentId = Number(this.selectedInstrumentId);
      filtered = filtered.filter(t =>
        t.teacher?.instruments?.some(inst => inst.id === instrumentId)  // שנה כאן
      );
    }
    if (this.selectedCreatedYear !== 'All') {
      const year = Number(this.selectedCreatedYear);
      filtered = filtered.filter(t => new Date(t.createdAt!).getFullYear() === year);
    }

    if (this.searchText && this.searchText.trim() !== '') {
      const txt = this.searchText.toLowerCase();
      filtered = filtered.filter(t =>
        t.profile!.name!.toLowerCase().includes(txt)
      );
    }

    this.TeacherList = filtered;
  }

  fillOutTheForm(): void {
    this.router.navigate(['/teacher-signup', this.currentUserId])
  }

  getExperiencedTeachersCount(minExperience: number = 5): number {
    return this.originalTeacherList.filter(teacher => teacher.teacher?.experience! >= minExperience).length;
  }

}
