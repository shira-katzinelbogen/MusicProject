import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // קרא JWT מ-cookie 'securitySample' (כמו ב-WebSocket)
//     const jwt = this.getJwtFromCookie('securitySample');
//     let authReq = req;

//     if (jwt) {
//       // הוסף Authorization header
//       authReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${jwt}`
//         },
//         withCredentials: true  // שמור על קוקיז אם צריך
//       });
//     }

//     return next.handle(authReq);
//   }

//   private getJwtFromCookie(name: string): string | null {
//     const matches = document.cookie.match(new RegExp(
//       '(?:^|; )' + name.replace(/([\.$?*|{}$$  $$$$  $$\\\/\+^])/g, '\\$1') + '=([^;]*)'
//     ));
//     return matches ? decodeURIComponent(matches[1]) : null;
//   }
}