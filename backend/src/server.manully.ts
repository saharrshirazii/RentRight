/////////local array (where you had to do everything manually)/////////////////

import express,  { Response, type Application, type Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectToDatabase} from './config/database.js'


dotenv.config();


const app: Application = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

//Connect to MongoDB
connectToDatabase();



//data base
let users: User[] = [
    { id: 1, name: 'Naja', email: 'Naja.chasacademy.se', role : 'admin' },
    { id: 2, name: 'Sahar', email: 'sahar.chasacademy.se', role: 'guest' },
    { id: 3, name: 'Johanna', email: 'johanna.chasacademy.se', role: 'host' },
]



app.get('/', (req: Request, res: Response): void => {
    res.send({ message: 'API is ready' });
});

// GET All Users
app.get('/users', (req: Request, res: Response): void => {
    res.json(users);
});

//READ User
app.get('/users/:id', (req: Request<UserParams>, res: Response): void => {
    const id = parseInt(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
       return void res.status(404).json({ message: 'User could not be located' });
    }

    res.json(user);
});

// CREATE User
app.post('/users', (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    const { name, email, role } = req.body;

    if (!name || !email) {
       return void res.status(404).json({ message: 'name and email are requierd.' });
    }

    const newUser: User = { id: users.length+1, name, email , role: role || 'guest' };
    users.push(newUser);

    return res.status(201).json(newUser);
});

//DELETE User
app.delete('/users/:id' , (req: Request<UserParams> , res: Response): void => {
    const id = parseInt(req.params.id);
    const user = users.find ((u) => u.id === id);

    if(!user){
        return void res.status(400).json({message: 'User not found.'});
    }

    users = users.filter((u) => {
        return u.id !== id ;
    });

    res.status(200).json({message: 'User deleted.'});
});

//UPDATE User
app.patch('/users/:id', (req: Request<UserParams, {}, UpdateUserBody>, res: Response):void => {
  const { name, email, role } = req.body;
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return void res.status(404).json({message: 'User not found'});
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

    res.status(200).json({message: 'User updated successfully', user});
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing in the environment variables!');
  process.exit(1); // Exit the process if configuration is missing
}

app.listen(PORT, () => {
    console.log(`server listening to http://localhost:${PORT}`);
})