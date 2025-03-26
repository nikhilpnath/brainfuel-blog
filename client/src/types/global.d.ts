import '@tanstack/react-query'
import { TAxiosError } from './types';

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: TAxiosError;
    }
}