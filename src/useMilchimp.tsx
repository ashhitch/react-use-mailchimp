import { useState } from 'react';
import fetch from 'jsonp-promise';

interface UseMailChimpOptionsProps {
  dontUpperCaseKeys?: boolean;
}

interface UseMailChimpProps {
  action: string;
  options: UseMailChimpOptionsProps;
}

export interface MailchimpFieldProps {
  [x: string]: string | number;
}

const regex = /^([\w_.\-+])+@([\w-]+\.)+([\w]{2,10})+$/;

export const useMailChimp = ({ action, options }: UseMailChimpProps) => {
  const [error, setError] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const handleError = (error: string) => {
    setError(error);
    setStatus(undefined);
    setLoading(false);
  };
  const handleReset = () => {
    setError(undefined);
    setStatus('Sending');
    setLoading(true);
  };

  const handleStatus = (data: string) => {
    setStatus(data);
    setLoading(false);
    setError(undefined);
  };

  const subscribe = async (passedFields: Partial<MailchimpFieldProps>) => {
    const fields = { ...passedFields };

    // Handle if user uses lowercase email field
    if (fields.email) {
      fields.EMAIL = fields.email;
    }

    try {
      // Test for valid email
      const { EMAIL } = fields;

      if (!EMAIL || !regex.test(`${EMAIL}`)) {
        handleError('Invalid email');
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

      const response: any = await fetch(url, { param: 'c' }).promise;

      if (response.status >= 400) {
        handleError('Failed to subscribe');
        return;
      }

      const data: any = response.json();

      if (data.msg.includes('already subscribed')) {
        handleStatus('duplicate');
      } else if (data.result !== 'success') {
        handleError('Failed to subscribe');
      } else {
        handleStatus('success');
      }

      handleStatus(response.json());
    } catch (e) {
      handleError('Failed to subscribe');
    }
  };

  return {
    error,
    loading,
    status,
    subscribe,
  };
};
