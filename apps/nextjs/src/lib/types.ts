export interface CURRENT_USER {
    username: string;
    image: string;
    id: number;
    providerId: number;
  }
  
export  interface MESSAGE {
    user: string | null | undefined;
    message: string;
    sentByUser: boolean;
    Date: string;
  }
  
export interface LIST_OF_USERS {
    email: string;
    id: number;
    image: string;
    name: string;
    provider: string;
    providerId: string;
  }