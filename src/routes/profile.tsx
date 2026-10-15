import { createFileRoute } from '@tanstack/react-router';
import { UserProfileView } from '../components/UserProfileView';

export const Route = createFileRoute('/profile')({
  head: () => ({
    meta: [
      { title: 'User Profile & Role Access | M-Pesa Sunday League' },
      {
        name: 'description',
        content:
          'View your assigned league role, council tier, and list of authorized management actions in the M-Pesa Sunday League.',
      },
    ],
  }),
  component: UserProfilePage,
});

function UserProfilePage() {
  return <UserProfileView />;
}
