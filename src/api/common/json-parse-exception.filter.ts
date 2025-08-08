import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(SyntaxError)
export class JSONParseExceptionFilter implements ExceptionFilter {
  catch(exception: SyntaxError, host: ArgumentsHost) {
    if (exception.message.includes('JSON')) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid JSON payload',
        error: 'Bad Request',
      });
    }

    throw exception;
  }
}
