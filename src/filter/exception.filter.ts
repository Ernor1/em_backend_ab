import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';
import { ApiResponse } from "src/responses/api.response";

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status: number = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message: string = this.getErrorMessage(exception);

        response.status(status).json(new ApiResponse(false, message, []));
    }

    private getErrorMessage(exception: any): string {
        if (exception instanceof HttpException) {
            return exception.message;
        }
        // Provide default error messages for common HTTP status codes
        switch (exception.status) {
            case HttpStatus.BAD_REQUEST:
                return 'Bad request';
            case HttpStatus.UNAUTHORIZED:
                return 'Unauthorized';
            case HttpStatus.FORBIDDEN:
                return 'Forbidden';
            case HttpStatus.NOT_FOUND:
                return 'Resource not found';
            default:
                return 'Internal server error';
        }
    }
}
