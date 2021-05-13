import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { UseMailchimpFieldProps, useMailChimp } from '../.';

const App = () => {

  const {error, loading, status, subscribe, message} = useMailChimp({ action: `https://<YOUR-USER>.us18.list-manage.com/subscribe/post?u=XXXXXX&amp;id=XXXXXX`});

const [inputs, setInputs] = React.useState<UseMailchimpFieldProps>();

const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs: UseMailchimpFieldProps) => ({...inputs, [event.target.name]: event.target.value}));
  }

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if(inputs) {
      subscribe(inputs);
    }
  }


  return (
    <>
    {error && <p>ERROR</p>}
    {loading && <p>...Loading</p>}
    {status && <p>{status}</p>}
    {message && <p>{message}</p>}

    <form onSubmit={handleSubmit}>
      <label htmlFor="mchimpEmail">Email</label>
      <input type="email" name="EMAIL" id="mchimpEmail" onChange={handleInputChange} />
      <button type="submit" >Sign me up!</button>
    </form>
  </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
