// pages/auth/error.tsx
import { useRouter } from 'next/router';

const AuthErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  let errorMessage = "An unexpected error occurred. Please try again.";

  // Customize error messages based on the error query parameter
  if (error === "OAuthAccountNotLinked") {
    errorMessage = "You have previously signed in with a different provider. Please use the same provider to sign in.";
  } else if (error === "OAuthCallback") {
    errorMessage = "There was an issue during the sign-in process. Please try again.";
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Authentication Error</h1>
      <p>{errorMessage}</p>
      <button onClick={() => router.push('/signin')}>
        Go to Sign In
      </button>
    </div>
  );
};

export default AuthErrorPage;
