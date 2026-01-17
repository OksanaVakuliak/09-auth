import instance from './api';
import type { Note, CreateNote } from '@/types/note';
import { User } from '@/types/user';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
}

export const clientApi = {
  login: async (credentials: AuthRequest): Promise<User> => {
    const { data } = await instance.post<User>('/auth/login', credentials);
    return data;
  },

  register: async (credentials: AuthRequest): Promise<User> => {
    const { data } = await instance.post<User>('/auth/register', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await instance.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const { data } = await instance.get<User>('/users/me');
    return data;
  },

  updateMe: async (userData: Partial<User>): Promise<User> => {
    const { data } = await instance.patch<User>('/users/me', userData);
    return data;
  },

  fetchNotes: async (
    page: number,
    perPage: number,
    search?: string,
    tag?: string
  ): Promise<FetchNotesResponse> => {
    const params = { page, perPage, search, tag };
    const { data } = await instance.get<FetchNotesResponse>('/notes', {
      params,
    });
    return data;
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    const { data } = await instance.get<Note>(`/notes/${id}`);
    return data;
  },

  createNote: async (note: CreateNote): Promise<Note> => {
    const { data } = await instance.post<Note>('/notes', note);
    return data;
  },

  deleteNote: async (id: string): Promise<Note> => {
    const { data } = await instance.delete<Note>(`/notes/${id}`);
    return data;
  },
};
