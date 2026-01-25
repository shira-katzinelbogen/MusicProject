import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Users, { EUserType } from '../../../Models/Users';
import { UsersService } from '../../../Services/users.service';
import { UserStateService } from '../../../Services/user-state.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from "../../../Pipes/highlight.pipe";
import { CommonModule } from '@angular/common';
import { NoResultsComponent } from '../../Shared/no-results/no-results.component';
import { ShortNumberPipe } from "../../../Pipes/short-number.pipe";
import { StatsCounterComponent } from "../../Shared/stats-counter/stats-counter.component";

@Component({
  selector: 'app-musicians',
  standalone: true,
  imports: [RouterModule, MatIcon, FormsModule, HighlightPipe, CommonModule, NoResultsComponent, StatsCounterComponent],
  templateUrl: './musicians.component.html',
  styleUrl: './musicians.component.css'
})

export class MusiciansComponent implements OnInit {

  public isShowDetails: boolean = false;
  public selectedUser!: Users;
  showFilters: boolean = false;

  public usersInMyCityAndCountry = 0;

  public userCity: string | undefined = "";
  public userCountry: string | undefined = "";

  public users: Users[] = [];
  public musicianList: Users[] = [];
  public originalMusicianList: Users[] = [];
  public user!: Users;
  public currentUserId: number | null = null;
  public isMusician: boolean = false;
  public needsProfileUpdate: boolean = false;
  public searchText: string = '';

  // Filtering options
  public cities: string[] = ['All'];
  public countries: string[] = ['All'];
  public createdYears: string[] = ['All'];
  public selectedCity: string = 'All';
  public selectedCountry: string = 'All';
  public selectedCreatedYear: string = 'All';

  constructor(
    private router: Router,
    private _usersService: UsersService,
    private _userStateService: UserStateService,
    public fileUtilsService: FileUtilsService,
    public navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this._userStateService.currentUser$.subscribe(userProfile => {
      if (userProfile) {
        this.currentUserId = userProfile.id;

        this._usersService.getCurrentUserMusicianDetails().subscribe({
          next: fullUser => {
            this.user = fullUser;
            this.isMusician = (fullUser.userTypes || []).includes(EUserType.MUSICIAN);
            this.needsProfileUpdate = !fullUser.city || !fullUser.description;

            this.userCity = fullUser.city;
            this.userCountry = fullUser.country;

            this._usersService.getMusicians().subscribe({
              next: res => {
                const onlyMusicians = res.filter(u => (u.userTypes || []).includes(EUserType.MUSICIAN));
                this.originalMusicianList = onlyMusicians;
                this.extractMusicianFilterOptions(onlyMusicians);
                this.applyMusicianFilters();

                this.calculateSameCityAndCountry();
              }
            });
          }
        });

      }
    });

    this._userStateService.loadCurrentUser();

    this.loadMusicians();
  }

  loadMusicians(): void {
    this._usersService.getMusicians().subscribe({
      next: res => {
        const onlyMusicians = res.filter(u => (u.userTypes || []).includes(EUserType.MUSICIAN));
        this.users = onlyMusicians;
        this.originalMusicianList = onlyMusicians;

        this.extractMusicianFilterOptions(onlyMusicians);
        this.applyMusicianFilters();
        this.calculateSameCityAndCountry();
      },
      error: err => console.error('Error loading musicians:', err)
    });
  }

  joinMusicianNetwork(): void {
    if (!this.user) return;

    if ((this.user.userTypes || []).includes(EUserType.MUSICIAN)) {
      console.log('User is already a musician.');
      return;
    }

    if (this.needsProfileUpdate) {
      this.router.navigate(['/edit-profil-modal', this.currentUserId]);
    } else {
      this.updateUserTypeToMusician(this.user.id!);
    }
  }

  updateUserTypeToMusician(userId: number): void {
    this._usersService.updateCurrentUserTypeToMusician().subscribe({
      next: () => {
        alert('Welcome to the musicians network!');
        const userTypes = new Set(this.user.userTypes || []);
        userTypes.add(EUserType.MUSICIAN);
        this.user.userTypes = Array.from(userTypes);

        const currentUser = this._userStateService.getCurrentUserValue();
        if (currentUser) {
          this._userStateService.currentUserSubject.next({
            ...currentUser,
            userTypes: [...(this.user.userTypes || [])]
          });
        }

        this.loadMusicians();
      },
      error: err => {
        console.error('Error updating user type:', err);
        alert('Failed to update profile. Please try again later.');
      }
    });
  }

  extractMusicianFilterOptions(musicians: Users[]): void {
    const citySet = new Set<string>();
    const countrySet = new Set<string>();
    const yearSet = new Set<number>();

    musicians.forEach(m => {
      if (m.city) citySet.add(m.city.trim());
      if (m.country) countrySet.add(m.country.trim());
      if (m.createdAt) yearSet.add(new Date(m.createdAt).getFullYear());
    });

    this.cities = ['All', ...Array.from(citySet).sort()];
    this.countries = ['All', ...Array.from(countrySet).sort()];
    this.createdYears = ['All', ...Array.from(yearSet).sort((a, b) => b - a).map(String)];
  }

  applyMusicianFilters(): void {
    let filtered = this.originalMusicianList;

    if (this.selectedCity !== 'All') filtered = filtered.filter(m => m.city?.trim() === this.selectedCity);
    if (this.selectedCountry !== 'All') filtered = filtered.filter(m => m.country?.trim() === this.selectedCountry);
    if (this.selectedCreatedYear !== 'All') {
      const year = parseInt(this.selectedCreatedYear, 10);
      filtered = filtered.filter(m => new Date(m.createdAt!).getFullYear() === year);
    }

    if (this.searchText.trim() !== '') {
      const text = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(m => m.profile?.name?.toLowerCase().includes(text));
    }

    this.musicianList = filtered;
  }


  getUsersJoinedThisYear(): number {
    const currentYear = new Date().getFullYear();

    return this.users.filter(u => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt).getFullYear() === currentYear;
    }).length;
  }


  calculateSameCityAndCountry(): void {
    if (!this.user) {
      this.usersInMyCityAndCountry = 0;
      return;
    }

    if (!this.userCity || !this.userCountry) {
      this.usersInMyCityAndCountry = 0;
      return;
    }

    this.usersInMyCityAndCountry = this.originalMusicianList.filter(u =>
      u.city!.trim().toLowerCase() === this.userCity!.trim().toLowerCase() &&
      u.country!.trim().toLowerCase() === this.userCountry!.trim().toLowerCase() &&
      u.id !== this.user.id
    ).length;
  }

}
