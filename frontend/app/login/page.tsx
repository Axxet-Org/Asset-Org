'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    const res = await api.post('/auth/login', data);
    setToken(res.data.access_token);
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 rounded-xl border p-8 shadow">
        <h2 className="text-2xl font-bold text-blue-700">Sign In</h2>
        <div>
          <input {...register('email')} placeholder="Email" className="w-full rounded border px-3 py-2" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full rounded border px-3 py-2" />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </main>
  );
}
