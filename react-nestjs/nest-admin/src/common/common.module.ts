import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

const secret = '1234'

@Module({
  imports: [
    JwtModule.register({
      secret: secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtModule]
})
export class CommonModule {}
