declare namespace Signup {
    type UserPicture = `https://${number}.${number}.${number}.${number}/${string}/${string}` | "";

    interface ISignUpObject {
        realName: string,
        accountName: string,
        provider: string,
        email: string,
        password: string,
        avatar: UserPicture,
    }
    interface IJwtTokenObject {
        token: string,
        expire: string,
    }
    interface ISignUpResponse {
        data: {
            accessToken: string,
            accessExpired: string,
            user: Dengta.IUserObject
        }
    }
    
}