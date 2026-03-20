export interface Project {
    id: string; // uuid
    user_id: string; // uuid from auth.users
    name: string;
    created_at: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
    id: string; // uuid
    project_id: string; // uuid
    user_id: string; // uuid
    role: MessageRole;
    content: string;
    created_at: string;
}
