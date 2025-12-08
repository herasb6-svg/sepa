import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola, soy edu y soy un cacahuate';
  }
}
