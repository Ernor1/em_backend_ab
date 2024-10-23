export class ApiResponse {
    message: string
    success: boolean
    data: object

    constructor(success: boolean, message: string, data: object) {
        this.success = success
        this.message = message
        this.data = data

    }


}