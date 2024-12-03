import { Routes, Route, Navigate } from 'react-router';
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@clerk/clerk-react';
import Dashboard from '@/components/Dashboard';
import PetDetails from '@/components/PetDetails';


const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/sign-in/*"
        element={
          <SignedOut>
            <SignIn routing="path" path="/sign-in" />
          </SignedOut>
        }
      />
      <Route
        path="/sign-up/*"
        element={
          <SignedOut>
            <SignUp routing="path" path="/sign-up" />
          </SignedOut>
        }
      />
      <Route
        path="/"
        element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        }
      />
      <Route
        path="/pet/:id"
        element={
          <SignedIn>
            <PetDetails />
          </SignedIn>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;