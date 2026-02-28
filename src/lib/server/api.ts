import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { fileRoutes } from './routes/file';
import { withContext } from './context';

export const api = new Elysia({ prefix: '/api' }).use(openapi()).use(withContext).use(fileRoutes);
