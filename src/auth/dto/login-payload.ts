import { Status } from "@prisma/client"

export class LoginPayload {
    id: string
    email: string
    userName: string
    token: string
    status: Status
}