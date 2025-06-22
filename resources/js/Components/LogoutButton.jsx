import { Link } from '@inertiajs/react';

export default function LogoutButton({ className = '', ...props }) {
    return (
        <Link
            href={route('logout')}
            method="post"
            as="button"
            className={`px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 ${className}`}
            {...props}
        >
            ログアウト
        </Link>
    );
}
