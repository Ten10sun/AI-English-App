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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#23272a] pt-6 sm:justify-center sm:pt-0">
            <Head title="ログイン" />
            {/* ファビコン画像をカード上部に表示 */}
            <div className="relative w-full flex justify-center">
                <img src="/favicon.png" alt="Ten-EnglishApp" className="w-20 h-20 absolute -top-12 z-10 drop-shadow-lg" />
            </div>
            <div className="relative mt-12 w-full overflow-hidden bg-green-50/90 px-8 py-8 shadow-2xl sm:max-w-md sm:rounded-2xl border border-green-200 flex flex-col items-center">
                <div className="flex flex-col items-center mb-8 mt-4">
                    <div className="text-green-700 text-3xl font-extrabold mb-2">Ten-EnglishApp</div>
                    <div className="text-gray-500 text-base">ログインして英語学習を始めよう！</div>
                </div>
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
                <form onSubmit={submit} className="space-y-6 w-full">
                    <div>
                        <InputLabel htmlFor="email" value="メールアドレス" className="text-green-900" />
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10 mt-1 block w-full bg-white border-green-200 focus:border-green-400 focus:ring-green-200"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password" value="パスワード" className="text-green-900" />
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="pl-10 mt-1 block w-full bg-white border-green-200 focus:border-green-400 focus:ring-green-200"
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
                            <span className="ms-2 text-sm text-green-700">ログイン状態を保持</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-green-600 hover:underline"
                            >
                                パスワードをお忘れですか？
                            </Link>
                        )}
                    </div>
                    <PrimaryButton className="w-full py-3 text-base font-bold rounded-xl shadow-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:ring-green-400 focus:ring-2 border-none" disabled={processing}>
                        ログイン
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
