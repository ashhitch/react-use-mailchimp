import { useState } from 'react';
import fetch from 'jsonp-promise';

export interface UseMailChimpOptionsProps {
  dontUpperCaseKeys?: boolean;
}

export interface UseMailChimpProps {
  action: string;
  options?: UseMailChimpOptionsProps;
}

export interface UseMailchimpFieldProps {
  [x: string]: string | number;
}

export interface UseMailChimpResponse {
  error: boolean;
  loading: boolean;
  status: UseMailChimpStatus;
  message: string | undefined;
  subscribe: (passedFields: Partial<UseMailchimpFieldProps>) => Promise<void>;
}

const regex = /^([\w_.\-+])+@([\w-]+\.)+([\w]{2,10})+$/;

export type UseMailChimpStatus = 'sending' | 'duplicate' | 'success' | 'failed' | undefined;

export const useMailChimp = ({ action, options }: UseMailChimpProps): UseMailChimpResponse => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<UseMailChimpStatus>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleError = (error: boolean) => {
    setError(error);
    setStatus(undefined);
    setLoading(false);
  };

  const handleReset = () => {
    setError(false);
    setMessage(undefined);
    setStatus('sending');
    setLoading(true);
  };

  const handleStatus = (data: UseMailChimpStatus) => {
    setStatus(data);
    setLoading(false);
    setError(false);
  };

  const subscribe = async (passedFields: Partial<UseMailchimpFieldProps>) => {
    const fields = { ...passedFields };

    // Handle if user uses lowercase email field
    if (fields.email) {
      fields.EMAIL = fields.email;
    }

    try {
      // Test for valid email
      const { EMAIL } = fields;

      if (!EMAIL || !regex.test(`${EMAIL}`)) {
        handleError(true);
        setMessage('Invalid email');
        return;
      }

      // if used lowercase befeore then we should restore it...
      if (fields.email && fields.EMAIL) {
        delete fields.EMAIL;
      }

      // Build values as url stirng
      const values = Object.entries(fields)
        .map(([key, value]) => {
          const formattedKey = options?.dontUpperCaseKeys ? key : key.toUpperCase();
          return `${formattedKey}=${encodeURIComponent(value || '')}`;
        })
        .join('&');

      // base action and values
      const path = `${action}&${values}`;

      // Make sure it is the json url path
      const url = path.replace('/post?', '/post-json?');

      // Reset everything for try
      handleReset();

      const data = await fetch(url, { param: 'c' }).promise;

      // Always set a the message that comes back from MC
      setMessage(data.msg);

      // Is the user already in the MC list
      if (data.msg.includes('already subscribed')) {
        handleStatus('duplicate');
        // Check we are not getting any other errors back
      } else if (data.result !== 'success') {
        handleError(true);
      } else {
        handleStatus('success');
      }
    } catch (e) {
      handleError(true);
      setMessage(e);
    }
  };

  return {
    error,
    loading,
    status,
    message,
    subscribe,
  };
};
