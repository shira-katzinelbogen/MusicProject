import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentModalService {
    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

    private postIdSubject = new BehaviorSubject<number | null>(null);
    postId$ = this.postIdSubject.asObservable();

    private _commentAdded = new Subject<Comment>();
    commentAdded$ = this._commentAdded.asObservable();

    notifyCommentAdded(comment: Comment) {
        this._commentAdded.next(comment);
    }


    open(postId: number) {
        this.postIdSubject.next(postId);
        this.isOpenSubject.next(true);
    }

    close() {
        this.isOpenSubject.next(false);
        this.postIdSubject.next(null);
    }
}
