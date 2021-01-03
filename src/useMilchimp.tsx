import  { useState } from 'react';
import fetch from 'isomorphic-fetch';

interface UseMailChimpProps
{
  action: string;
}

export interface MailchimpFieldProps {
  email: string;
  [x: string]: string | number; 
}

const regex = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;

export const useMailChimp = ({ action }: UseMailChimpProps) =>
{
  const [error, setError] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);


  const handleError = (error: string) =>
  {
    setError(error);
    setStatus(undefined);
    setLoading(false);
  }
  const handleReset = () =>
  {
    setError(undefined);
    setStatus('Sending');
    setLoading(true);
  }

  const handleStatus = (data: string) =>
  {
    setStatus(data);
    setLoading(false);
    setError(undefined);
  }


  const subscribe = async (fields: Partial<MailchimpFieldProps>) =>
  {

    try {

      // Test fir valid email
      const { email } =  fields;

      if(!email || !regex.test(email)) {
        handleError('invalid email');
        return;
      }

      // Build values as url stirng
      const values = Object.entries(fields).map((key, value) => {
        return `${key}=${encodeURIComponent(value)}`;
      }).join("&");

      // base action and values
    const path = `${action}&${values}`;

    // Make sure it is the json url path
    const url = path.replace('/post?', '/post-json?');

// Reset everything for try 
      handleReset();

      const response: any = await fetch(url);

      if (response.status >= 400) {
        handleError('Failed to subscribe');
        return;
      }

      const data: any = response.json();

      if (data.msg.includes("already subscribed")) {
        handleStatus('duplicate' );
      }
       else if (data.result !== 'success') {
        handleError('Failed to subscribe');
    } else {
        handleStatus('success' );
      };

      handleStatus(response.json());
    } catch (e) {
      handleError('Failed to subscribe');
    }
  }

  return ({
    error,
    loading,
    status,
    subscribe
  });
};


