# Use React MailChimp

It provides an easy-to use React Hook to subscribe users to your MailChimp lists

# Install

```npm
npm install react-use-mailchimp-signup --save
```

```npm
yarn add react-use-mailchimp-signup
```

## Version 2

Note version 2 fixes possible CORs issues and includes a breaking change to return `error` as a Boolean.
You can now get more information about the error (and success) from the new `message` property

# Usage

```jsx
import React, { useState } from 'react';
// import the hook
import { useMailChimp } from 'react-use-mailchimp-signup';

export const MyComponent = () => {
  const { error, loading, status, subscribe, message } = useMailChimp({
    action: `https://<YOUR-USER>.us18.list-manage.com/subscribe/post?u=XXXXXX&amp;id=XXXXXX`,
  });

  const [inputs, setInputs] = useState({});

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (inputs) {
      subscribe(inputs);
    }
  };

  return (
    <>
      {error && <p>ERROR</p>}
      {loading && <p>...Loading</p>}
      {status && <p>{status}</p>}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="mchimpEmail">Email</label>
        <input type="email" name="email" id="mchimpEmail" onChange={handleInputChange} />
        <button type="submit">Sign me up!</button>
      </form>
    </>
  );
};
```

## Response from `subscribe` method

```
  error: boolean;
  loading: boolean;
  status: UseMailChimpStatus;
  message: string | undefined;
  subscribe: (passedFields: Partial<UseMailchimpFieldProps>) => Promise<void>;
```
