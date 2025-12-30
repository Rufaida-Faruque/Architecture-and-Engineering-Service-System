import React from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/register');  // Redirect to register page
  };

  return (
    <div>
      <h1>Welcome to the Application</h1>
      <button onClick={handleClick}>Click to Continue Setup</button>
    </div>
  );
};

export default IndexPage;
