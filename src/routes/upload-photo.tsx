import { createFileRoute } from '@tanstack/react-router';
import { PlayerPhotoUploadPortal } from '../components/PlayerPhotoUploadPortal';

export const Route = createFileRoute('/upload-photo')({
  head: () => ({
    meta: [
      { title: 'Player Photo Upload Portal | M-Pesa Sunday League' },
      {
        name: 'description',
        content:
          'Official portal for student athletes to upload and publish their profile pictures for the M-Pesa Sunday League.',
      },
    ],
  }),
  component: UploadPhotoPage,
});

function UploadPhotoPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <PlayerPhotoUploadPortal />
    </div>
  );
}
