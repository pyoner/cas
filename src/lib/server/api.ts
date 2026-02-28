import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { withContext } from './context';
import { fileRoutes } from './routes/file';

export const api = new Elysia({ prefix: '/api' }).use(openapi()).use(withContext).use(fileRoutes);
