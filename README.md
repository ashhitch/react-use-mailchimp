# Use React MailChimp

It provides an easy-to use React Hook to subscribe users to your MailChimp lists

# Install

```npm
npm install react-use-mailchimp --save
```

```npm
yarn add react-use-mailchimp
```

# Usage

```jsx
import React, { useState } from 'react';
// import the hook
import { useMailChimp } from 'react-use-mailchimp';

export const MyComponent = () => {
  const { error, loading, status, subscribe } = useMailChimp({
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
      {error && <p>{error}</p>}
      {loading && <p>...Loading</p>}
      {status && <p>{status}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="mchimpEmail">Email</label>
        <input
          type="email"
          name="email"
          id="mchimpEmail"
          onChange={handleInputChange}
        />
        <button type="submit" />
      </form>
    </>
  );
};
```
