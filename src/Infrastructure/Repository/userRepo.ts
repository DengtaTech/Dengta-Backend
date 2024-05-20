import { User } from "../../Database/Entities/user.js";
import { EntityManager } from "typeorm";
export const userRepo = {
    insertNewUser: async (realName: string, accountName: string, transactionManager: EntityManager): Promise<User> => {
        try {
            const jane = new User();
            jane.realName = realName;
            jane.accountName = accountName;
            const savedUser = await transactionManager.save(jane);
            console.log(savedUser);
            return savedUser;
        } catch (error) {
            throw error;
        }
    },
    findById: async (userId: number): Promise<User | null> => {
        try {
            const user = await User.findOne({ where: { id: userId } });
            console.log(user);
            return user;
        } catch (error) {
            throw error;
        }
    },
    
}
