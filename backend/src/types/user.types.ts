export interface User {
    id: number;
    name: string;
    email: string;
    role: 'guest' | 'host' | 'admin' ;
}

export interface UserParams {
    id: string;
}

export interface CreateUserBody {
    name: string;
    email: string;
    role: 'guest' | 'host' | 'admin' ;
}


export interface UpdateUserBody {
    name: string;
    email: string;
    role: 'guest' | 'host' | 'admin' ;
}

