import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { config } from '@config/index.ts';
import logger from '@utils/logger.ts';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from '@middleware/error.handler.ts';
import { responseFormatter } from '@middleware/respone.formatter.ts';
import adminRouter from '@utils/admin.ts';
import { swaggerSpec } from '@docs/swagger.ts';
import featureRoutes from './features/routes.ts';

const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/admin', adminRouter);
app.use('/api', featureRoutes);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
// app.use(config.limiter);
app.use(responseFormatter);

// Ensure uploads/imports directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'imports');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`Created uploads directory : ${uploadsDir}`);
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/imports/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '_' + file.originalname);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow CSV files, JSON files, and common document formats
    if (
      file.mimetype === 'text/csv' ||
      file.originalname.endsWith('.csv') ||
      file.mimetype === 'application/json' ||
      file.originalname.endsWith('.json') ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, JSON, and Excel files are allowed'));
    }
  },
});

// Make upload available globally
app.locals.upload = upload;

// ROUTES
app.use('/', featureRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Admin is running in on  ${process.env.BASE_URL}/admin`);
  logger.info(`Server is running on ${process.env.BASE_URL}/`);
  logger.info(`Docs at ${process.env.BASE_URL}/docs`);
});
