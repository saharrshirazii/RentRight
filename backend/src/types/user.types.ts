export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'guest' | 'host' | 'admin' ;
}

export interface UserParams {
    id: string;
}

export interface CreateUserBody {
    name: string;
    email: string;
    password: string;
    role: 'guest' | 'host' | 'admin' ;
}


export interface UpdateUserBody {
    name?: string;
    email?: string;
    password?: string;
    role?: 'guest' | 'host' | 'admin' ;
}

