import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsoleController } from './console/console.controller';

@Module({
  imports: [],
  controllers: [AppController, ConsoleController],
  providers: [AppService],
})
export class AppModule {}
