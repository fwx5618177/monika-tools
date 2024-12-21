import User from '../models/User';

const createUser = async (userData: any) => {
    const newUser = new User(userData);
    return newUser.save();
};

const getUserById = async (id: string) => {
    return User.findById(id);
};

export default {
    createUser,
    getUserById
};
