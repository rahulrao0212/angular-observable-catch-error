import { Component } from '@angular/core';
import { from, of, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-observable-catch-error';
  srcArray = from([1, 2, 'A', 4]);
  count = 0;
  obs = this.srcArray
    .pipe(
      map(val => {
        let result = val as number * 2;
        if (Number.isNaN(result)) {
          console.log('Error Occurred in Stream')
          throw new Error("Result is NaN")
        }
        return result
      }),

      // //retry
      // retry(1),

      // catchError((error) => {
      //   // // returning an observable on catch
      //   // console.log('Caught in CatchError. Returning 0')
      //   // return of(0);

      //   // //throwing new error
      //   // console.log('Caught in CatchError and Throwing error')
      //   // throw new Error(error);

      //   // //throwing error
      //   console.log('Caught in CatchError and Throwing error')
      //   return throwError(error);
      // })

      catchError((error, src) => {
        console.log('Caught in CatchError. Throwing error')
        this.count++;
        if (this.count <= 2) {
          return src;
        } else {
          return throwError(error)
        }
      })
    );

  ngOnInit() {

    this.obs.subscribe(
      el => {
        console.log('Value Received ' + el)
      },
      err => {
        console.log("Error Returned to Subscriber " + err)
      },
      () => console.log("Processing Completed")
    )
  }
}
