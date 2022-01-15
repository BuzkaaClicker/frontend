export class ErrorResponse {
    message: string;

    constructor(message: string) {
        this.message = message;
    }

    public static fromJson(json: any) {
        return new ErrorResponse(json.error_message)
    }
}