import { Get, Controller, Query, Redirect } from '@nestjs/common';
//var html = require('./console.controller.html').default
@Controller('console')
export class ConsoleController {
  @Get(':command')
  @Redirect('/console')
  findOne(@Query() request): string {
    console.log('command recieved: ' + request.command);
    return 'This action will run command: ' + request.command;
  }
  @Get()
  findAll(): string {
    return 'Thiss will display the console.';
  }
}
