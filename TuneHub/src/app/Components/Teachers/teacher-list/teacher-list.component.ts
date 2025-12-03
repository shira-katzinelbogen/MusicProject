import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Users, { UserType } from '../../../Models/Users';
import { UsersService } from '../../../Services/users.service';
import { UserStateService } from '../../../Services/user-state.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { SafeUrl } from '@angular/platform-browser';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import Instrument from '../../../Models/Instrument';
import { HighlightPipe } from "../../Shared/highlight/highlight.component";


@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [RouterModule, FormsModule, HighlightPipe],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.css'
})
export class TeacherListComponent implements OnInit {

  public users: Users[] = [];
  public isShowDetails: boolean = false;
  public selectedUser!: Users;
  showFilters: boolean = false;
  public user!: Users;
  public isTeacher: boolean = false;
  public needsProfileUpdate: boolean = false;
  private currentUserId: number | null = null;

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
    private _userStateService: UserStateService,
    public fileUtilsService: FileUtilsService,
    public navigationService: NavigationService,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    const currentUser = this._userStateService.getCurrentUserValue();

    if (!currentUser) {
      console.error("No logged-in user");
      return;
    }

    this.currentUserId = currentUser.id;
    console.log("User ID:", this.currentUserId);

    this.loadTeachers();

    this._usersService.getUserById(this.currentUserId).subscribe({
      next: (fullUser) => {
        this.user = fullUser;

        const userTypes: UserType[] = this.user.userTypes || [];
        this.isTeacher = userTypes.includes(UserType.TEACHER);
        this.needsProfileUpdate = !this.user.city || !this.user.description;
      },
      error: (err) => console.error('Error loading current user:', err)
    });
  }


  loadCurrentUser(userId: number): void {
    this._usersService.getUserById(userId).subscribe({
      next: (currentUser: Users) => {
        this.user = currentUser;

        const userTypes: UserType[] = this.user.userTypes || [];
        this.isTeacher = userTypes.includes(UserType.TEACHER);
        this.needsProfileUpdate =
          !this.user.city ||
          !this.user.description;

        console.log("User loaded:", this.user);
      },
      error: (err) => {
        console.error("Error loading current user:", err);
      }
    });
  }



  loadTeachers(): void {
    this._usersService.getUsersByUserType(UserType.TEACHER).subscribe({
      next: (res) => {
        console.log(' from server:', res);
        console.log('Raw response:', res);
        res.forEach(u => console.log('Teacher for user', u.id, ':', u.teacher));


        this.users = res;

        this.originalTeacherList = res;

        this.extractTeachersFilterOptions(res);

        this.applyTeacherFilters();

        console.log('Teacher data loaded and updated. Number of teachers:', this.users.length);
        console.log("teachers:", this.users);

        console.log("CreatedAt values:", res.map(u => u.createdAt));
        console.log("CreatedAt values:");


      },
      error: (err) => {
        console.error('Error fetching teacher data:', err);
      }
    });
  }
  joinTeacherNetwork(): void {
    if (this.isTeacher) {
      console.log('The user is already set as a teacher.');
      return;
    }

    if (this.needsProfileUpdate) {
      this.router.navigate(['/edit-profil-modal', this.currentUserId]);
    } else {
      const idToUse = this.user?.id ?? this.currentUserId;

      if (!idToUse) {
        console.error('Cannot find the user ID.');
        return;
      }

      if (!this.user) {
        this.user = { id: idToUse } as Users;
      }

      this.updateUserTypeToTeacher(idToUse);
    }
  }

  updateUserTypeToTeacher(userId: number): void {
    if (!userId) {
      console.error("User has no ID!");
      return;
    }

    if (this.isTeacher) {
      console.log('The user is already set as a teacher.');
      return;
    }

    if (!this._userStateService.hasRole('ROLE_USER')) {
      console.error('User does not have appropriate permissions to update user type.');
      return;
    }

    this._usersService.updateUserType(userId, UserType.TEACHER).subscribe({
      next: () => {
        this.isTeacher = true;
        alert('Welcome to the teachers network!');
        if (this.user) {
          const userTypes: UserType[] = this.user.userTypes || [];

          if (!userTypes.includes(UserType.TEACHER)) {
            userTypes.push(UserType.TEACHER);
          }
          this.user.userTypes = [...userTypes];
        }

        this.loadTeachers();
      },
      error: (err) => {
        console.error('Error updating user type:', err);
        alert('Error updating profile. Try again later.');
      }
    });
  }

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
    console.log("teachers:", this.TeacherList);

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
      if (u.teacher?.instrumentsIds) {
        u.teacher.instrumentsIds.forEach(id => {
          if (!instrumentMap.has(id)) {
            instrumentMap.set(id, `Instrument ${id}`);
          }
        });
      }
    });
    this.instruments = Array.from(instrumentMap.entries()).map(([id, name]) => ({ id, name }));

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

      filteredList = filteredList.filter(u => u.teacher?.instrumentsIds?.includes(targetId));
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
      filtered = filtered.filter(t => t.teacher?.instrumentsIds?.includes(instrumentId));
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
}
