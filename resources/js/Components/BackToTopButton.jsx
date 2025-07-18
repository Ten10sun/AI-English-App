import { Link } from '@inertiajs/react';

export default function BackToTopButton({ className = '', ...props }) {
    return (
        <Link
            href={route('top')}
            className={`px-6 py-2 bg-[#4A6D4D] text-white font-semibold rounded-lg hover:bg-[#5a8a5d] ${className}`}
            {...props}
        >
            トップに戻る
        </Link>
    );
}
