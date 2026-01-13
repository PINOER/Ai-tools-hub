import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { promises as fs } from 'fs';
import { EntityType } from '@prisma/client';
import logger from '../../../utils/logger.ts';
import { ProcessorFactory } from './processors/processorFactory.ts';
import { PrismaClient } from '@prisma/client';

export class WorkerThreadService {
  async processImportInWorker(
    jobId: string,
    entityType: EntityType,
    filePath: string,
    options: any
  ): Promise<{
    success: boolean;
    totalRows: number;
    processedRows: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  }> {
    return new Promise((resolve, reject) => {
      // Use URL approach - Node.js will handle TypeScript if tsx is registered
      // For ES modules, we need to use file URL with proper import registration
      const workerUrl = new URL(import.meta.url);
      // Try using tsx register for TypeScript support
      const execArgv = [...process.execArgv];
      // Only add tsx import if not already present and we're in a tsx environment
      if (!execArgv.some((arg) => arg.includes('tsx'))) {
        try {
          // Try to use tsx import hook
          execArgv.push('--import', 'tsx');
        } catch {
          // Fallback: use the file directly (will work if running with tsx)
        }
      }
      const worker = new Worker(workerUrl, {
        workerData: {
          type: 'import',
          jobId,
          entityType,
          filePath,
          options,
        },
        execArgv,
      });

      worker.on('message', (result) => {
        resolve(result);
        worker.terminate();
      });

      worker.on('error', (error) => {
        logger.error(`Worker error for job ${jobId}:`);
        console.log(error);
        reject(error);
        worker.terminate();
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      // Set timeout for worker
      setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timeout'));
      }, 300000); // 5 minutes timeout
    });
  }

  /**
   * Process export job in a separate worker thread
   */
  async processExportInWorker(
    jobId: string,
    entityType: EntityType
  ): Promise<{
    success: boolean;
    filePath: string;
    totalRecords: number;
    s3Url?: string;
    error?: string;
  }> {
    return new Promise((resolve, reject) => {
      // Use URL approach - Node.js will handle TypeScript if tsx is registered
      const workerUrl = new URL(import.meta.url);
      // Try using tsx register for TypeScript support
      const execArgv = [...process.execArgv];
      // Only add tsx import if not already present and we're in a tsx environment
      if (!execArgv.some((arg) => arg.includes('tsx'))) {
        try {
          // Try to use tsx import hook
          execArgv.push('--import', 'tsx');
        } catch {
          // Fallback: use the file directly (will work if running with tsx)
        }
      }
      const worker = new Worker(workerUrl, {
        workerData: {
          type: 'export',
          jobId,
          entityType,
        },
        execArgv,
      });

      worker.on('message', (result) => {
        resolve(result);
        worker.terminate();
      });

      worker.on('error', (error) => {
        logger.error(`Export worker error for job ${jobId}:`);
        console.log(error);
        reject(error);
        worker.terminate();
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      // Set timeout for worker
      setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timeout'));
      }, 300000); // 5 minutes timeout
    });
  }
}

// Worker thread code (runs in separate thread)
if (!isMainThread && workerData) {
  const { type, jobId, entityType, filePath } = workerData;

  if (type === 'import') {
    processImportJob(jobId, entityType, filePath);
  } else if (type === 'export') {
    processExportJob(jobId, entityType);
  }
}

/**
 * Parse CSV row properly handling quoted fields
 */
function parseCSVRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last value
  values.push(current.trim());

  // Remove quotes from values
  return values.map((value) => value.replace(/^"|"$/g, ''));
}

async function processImportJob(jobId: string, entityType: EntityType, filePath: string) {
  // Initialize Prisma client in worker thread
  const prisma = new PrismaClient();

  try {
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`File not accessible: ${filePath}`);
    }

    const csvContent = await fs.readFile(filePath, 'utf-8');
    const lines = csvContent.split('\n').filter((line) => line.trim());
    const totalRows = lines.length - 1; // Subtract header row

    logger.info(`CSV has ${totalRows} data rows`);

    if (totalRows === 0) {
      throw new Error('No data rows found in CSV');
    }

    const headers = lines[0].split(',').map((h) => h.trim());

    // Validate headers
    if (!headers || headers.length === 0) {
      throw new Error('No headers found in CSV');
    }

    const dataRows = lines.slice(1);

    logger.info(`Processing CSV with headers: ${headers.join(', ')}`);

    let processedRows = 0;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row.trim()) continue;

      const rowData: any = {};

      try {
        // Parse CSV row properly handling quoted fields
        const values = parseCSVRow(row);

        // Check if row has enough columns
        if (values.length < headers.length) {
          throw new Error(`Row has ${values.length} columns but expected ${headers.length}`);
        }

        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });

        logger.info(`Processing row ${i + 1}/${totalRows}`);

        const processor = ProcessorFactory.createProcessor(entityType, prisma);
        const processedData = await processor.processData(rowData);

        logger.info(`${entityType} created successfully with ID: ${processedData.id}`);
        successCount++;
        processedRows++;
      } catch (error) {
        const errorMsg = `Row ${i + 1}: ${(error as Error).message}`;
        logger.error(`Error processing row ${i + 1}: ${errorMsg}`);

        errors.push(errorMsg);
        errorCount++;
        processedRows++;
      }
    }

    console.log('🔥🔥🔥 Worker thread processing completed! 🔥🔥🔥');
    console.log(`Success: ${successCount}, Errors: ${errorCount}`);

    // Determine success based on whether there are any errors
    const hasErrors = errors.length > 0;
    const success = !hasErrors;

    // Update job directly in database with results
    try {
      await prisma.importExportJob.update({
        where: { id: jobId },
        data: {
          totalRows,
          processedRows,
          successCount,
          errorCount,
          errorLogs: hasErrors ? JSON.stringify(errors) : null,
          completedAt: new Date(),
          status: hasErrors ? 'Failed' : 'Completed',
        },
      });
      logger.info(
        `Job ${jobId} updated directly in database. Status: ${hasErrors ? 'Failed' : 'Completed'}`
      );

      if (success) {
        await fs.unlink(filePath);
      }
      logger.info(`CSV file deleted successfully: ${filePath}`);
    } catch (dbError) {
      logger.error(`Failed to update job ${jobId} in database:`, dbError);
    }

    // Send minimal result to main thread (for compatibility)
    parentPort?.postMessage({
      success,
      totalRows,
      processedRows,
      successCount,
      errorCount,
      errors,
      message: hasErrors
        ? `Processed ${processedRows} rows with ${errorCount} errors.`
        : `Processed ${processedRows} rows successfully.`,
    });

    // Cleanup Prisma client
    await prisma.$disconnect();
  } catch (error) {
    console.log('🔥🔥🔥 Worker thread error:', error);

    // Update job with error in database
    try {
      await prisma.importExportJob.update({
        where: { id: jobId },
        data: {
          totalRows: 0,
          processedRows: 0,
          successCount: 0,
          errorCount: 1,
          errorLogs: JSON.stringify([(error as Error).message]),
          completedAt: new Date(),
          status: 'Failed',
        },
      });
      logger.info(`Job ${jobId} updated with error in database`);
    } catch (dbError) {
      logger.error(`Failed to update job ${jobId} with error in database:`, dbError);
    }

    parentPort?.postMessage({
      success: false,
      error: (error as Error).message,
      totalRows: 0,
      processedRows: 0,
      successCount: 0,
      errorCount: 1,
      errors: [(error as Error).message],
    });

    // Cleanup Prisma client
    await prisma.$disconnect();
  }
}

async function processExportJob(jobId: string, entityType: EntityType) {
  // Initialize Prisma client in worker thread
  const prisma = new PrismaClient();

  try {
    const { CSVGeneratorService } = await import('./csvGenerator.service.ts');
    const csvGenerator = new CSVGeneratorService();

    // Generate CSV file using the service
    const result = await csvGenerator.exportEntityToCSV(prisma, entityType);

    parentPort?.postMessage({
      success: true,
      filePath: result.filePath,
      totalRecords: result.totalRecords,
      s3Url: result.s3Url,
    });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error: (error as Error).message,
      filePath: '',
      totalRecords: 0,
      s3Url: '',
    });
  } finally {
    await prisma.$disconnect();
  }
}
