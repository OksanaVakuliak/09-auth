import { cookies } from 'next/headers';
import instance from './api';
import { User } from '@/types/user';
import type { Note } from '@/types/note';
import { FetchNotesResponse } from './clientApi';
import { AxiosResponse } from 'axios';

interface SessionResponse {
  message: string;
}

export async function checkServerSession() {
  const cookieStore = await cookies();
  const authHeaders = {
    Cookie: cookieStore.toString(),
  };

  return instance.get<SessionResponse>('/auth/session', {
    headers: authHeaders,
  });
}

export const serverApi = {
  getAuthHeaders: async () => {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    return cookieString ? { Cookie: cookieString } : {};
  },

  fetchNotes: async (
    page: number,
    perPage: number,
    search?: string,
    tag?: string
  ): Promise<FetchNotesResponse> => {
    const headers = await serverApi.getAuthHeaders();
    const params = { page, perPage, search, tag };

    const { data } = await instance.get<FetchNotesResponse>('/notes', {
      params,
      headers,
    });
    return data;
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    const headers = await serverApi.getAuthHeaders();
    const { data } = await instance.get<Note>(`/notes/${id}`, { headers });
    return data;
  },

  getMe: async (): Promise<User> => {
    const headers = await serverApi.getAuthHeaders();
    const { data } = await instance.get<User>('/users/me', { headers });
    return data;
  },

  checkSession: async (): Promise<AxiosResponse<SessionResponse>> => {
    const headers = await serverApi.getAuthHeaders();
    return instance.get<SessionResponse>('/auth/session', {
      headers,
    });
  },
};
