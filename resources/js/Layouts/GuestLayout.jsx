import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <ApplicationLogo className="h-20 w-20 fill-current text-indigo-400 drop-shadow-lg" />
            </div>
            <div className="mt-6 w-full overflow-hidden bg-white/90 px-8 py-8 shadow-2xl sm:max-w-md sm:rounded-2xl border border-indigo-100">
                {children}
            </div>
        </div>
    );
}
