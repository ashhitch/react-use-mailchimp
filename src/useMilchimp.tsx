import React, {  useState } from 'react';



const useMilchimp = ({}) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  return ({error,
    loading,
    data})
};

export default useMilchimp;
