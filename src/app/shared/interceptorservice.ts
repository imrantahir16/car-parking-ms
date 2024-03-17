import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(private _router: Router) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token') != null) {
            const token = localStorage.getItem('token');
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    'Bearer ' + token)
            });
            return next.handle(cloned).pipe
                (
                    tap(
                        (succ: any) => {
                            if (succ.body !== undefined) {
                                if (succ.body.status === 401 || succ.body.status === 403) {
                                    this.redirect();
                                }
                            }
                        },
                        err => {
                            if (err.status === 401 || err.status === 403) {
                                this.redirect();
                            }
                        }
                    )
                );
        }
        else {
            return next.handle(req);
        }
    }

    redirect(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this._router.navigateByUrl('');
    }

}