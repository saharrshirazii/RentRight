import express , {Router , Request , Response , NextFunction} from 'express';
import  { UserParams, CreateUserBody , UpdateUserBody } from '../types/user.types' ;
import User from '../models/User';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /api/v1/users – get all users
router.get('/' , async(req: Request , res: Response , next: NextFunction) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(error){
        next(error);
    }
});

// GET /api/v1/users/:id – get a specific user
router.get('/:id' , async(req: Request , res: Response , next: NextFunction) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return void res.status(404).json({message: 'User not found.'})
        }
        res.json(user);
    }catch(error){
        next(error);
    }
});



//POST /api/v1/users - create a new user
router.post ('/' , async (req : Request<{} , {}, CreateUserBody> , res: Response , next: NextFunction) => {
    try {
        //Validation
        const {name , email, password , role} = req.body;
        if(!name || !email || !password) {
            return void res.status(404).json({message: 'Name, Email and Password are required.'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Mongoose handles ID generation and saving
        const createUser = await User.create({
            name ,
            email ,
            password: hashedPassword,
            role:role || 'guest'
        });

        res.status(201).json({
            id: createUser.id,
            name: createUser.name,
            email: createUser.email,
            role: createUser.role
        });
    }catch(error){
        next(error); // Pass to error-handling middleware
  }

});



// PATCH /api/v1/users/:id
router.patch('/:id', async (req: Request<UserParams, {}, UpdateUserBody>, res: Response, next: NextFunction) => {
    try {

        const { password, ...updateData } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true , runValidators: true });

        if (!updatedUser) {
            return void res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
});



// DELETE /api/v1/users/:id
router.delete('/:id', async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return void res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'User successfully deleted from database.',
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
});

export default router;
