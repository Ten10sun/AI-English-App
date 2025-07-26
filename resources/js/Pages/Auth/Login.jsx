import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaUser, FaLock } from 'react-icons/fa';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="ログイン" />
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-2 text-indigo-600">
                    <span className="text-3xl font-extrabold tracking-tight">Ten-EnglishApp</span>
                </div>
                <div className="mt-2 text-gray-500 text-sm">ログインして英語学習を始めよう！</div>
            </div>
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" />
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-10 mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="password" value="パスワード" />
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="pl-10 mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">ログイン状態を保持</span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-indigo-500 hover:underline"
                        >
                            パスワードをお忘れですか？
                        </Link>
                    )}
                </div>
                <PrimaryButton className="w-full py-3 text-base font-bold rounded-xl shadow-lg hover:scale-105 transition-transform duration-150" disabled={processing}>
                    ログイン
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
