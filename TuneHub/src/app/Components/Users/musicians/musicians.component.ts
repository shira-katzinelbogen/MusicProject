import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Users from '../../../Models/Users';
import  {UsersService } from '../../../Services/users.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-musicians',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './musicians.component.html',
  styleUrl: './musicians.component.css'
})
export class MusiciansComponent {


  public users: Users[] = [];
  public isShowDetails: boolean = false;
  public selectedUser!: Users;

  public user!: Users;

    
    constructor(private router: Router,private _usersService : UsersService, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
    this._usersService.getMusicians().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

      showDetails(u: Users) {
        this.router.navigate(['/user-profile', u.profile!.id])
      }

       getImageUrl(base64?: string): SafeUrl {
        if (base64 && base64.trim()) {
            const imageUrl = `data:image/png;base64,${base64}`;
            return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        }
        return 'assets/images/2.jpg'; 
    }
}
