import { AxiosError } from 'axios';

export function extractErrorMessage(error: AxiosError): string {
  return (error.response?.data?.message as string) || error.message || error.toString();
}
