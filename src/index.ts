import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import AuthRoutes from './routes/auth.routes';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoutes()]);

app.listen();
