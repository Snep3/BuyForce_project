import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseLoginDto } from './dto/firebase-login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 @Post('firebase')
async firebaseLogin(@Body() dto: FirebaseLoginDto) {
  return this.authService.loginWithFirebase(dto.idToken);
}

}
