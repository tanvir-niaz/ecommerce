import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";
import { User } from "../entities/user.entity";

@Injectable()
export class userInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log("From the interceptor");

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((user) => plainToInstance(User, user));
        } else {
          return plainToInstance(User, data);
        }
      }),
    );
  }
}
