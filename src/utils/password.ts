import bcrypt from 'bcryptjs'

export function saltAndHashPassword(password: string) {
    return bcrypt.hash(password, 12)
}
