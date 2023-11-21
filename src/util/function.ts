export function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

export function validatePassword(password: string){
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
    return re.test(password)
}

