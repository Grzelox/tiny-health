import { useUser } from "@clerk/nextjs";

/**
 * Hook to handle Clerk user authentication state
 * @returns Current authenticated user or null
 */
export const useAuthUser = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return user;
};
