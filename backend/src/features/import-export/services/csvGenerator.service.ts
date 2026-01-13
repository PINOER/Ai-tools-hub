import { stringify } from 'csv-stringify';
import { CSVRow } from '../validators/importExport.validator.ts';
import { EntityType } from '@prisma/client';
import { ProcessorFactory } from './processors/processorFactory.ts';
import { AwsService } from '../../aws/services/aws.service.ts';
import logger from '../../../utils/logger.ts';

export class CSVGeneratorService {
  private awsService: AwsService;

  constructor() {
    this.awsService = new AwsService();
  }

  /**
   * Export data for a specific entity type to CSV and upload to S3
   */
  async exportEntityToCSV(
    prisma: any,
    entityType: EntityType
  ): Promise<{ filePath: string; totalRecords: number; s3Url: string }> {
    try {
      logger.info(`Starting export for ${entityType}`);

      const processor = ProcessorFactory.createProcessor(entityType, prisma);

      const data = await processor.getExportData();

      // Generate CSV content in memory
      logger.info(`Generating CSV for ${data.records.length} records`);
      const csvContent = await this.generateCSVContent(data.records, data.headers);

      // Upload directly to S3
      const fileName = `${entityType.toLowerCase()}_export_${Date.now()}.csv`;
      const s3Key = `exports/${entityType.toLowerCase()}/${fileName}`;
      const s3Url = await this.awsService.uploadFileContent(csvContent, s3Key);

      logger.info(`Export completed successfully: ${data.records.length} records uploaded to S3`);
      return {
        filePath: s3Key,
        totalRecords: data.records.length,
        s3Url,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Export failed for ${entityType}: ${errorMessage}`);
      throw new Error(`Export failed for ${entityType}: ${errorMessage}`);
    }
  }

  /**
   * Generate CSV content in memory without creating local file
   */
  private async generateCSVContent(data: any[], headers?: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const stringifier = stringify({
        header: true,
        delimiter: ',',
        quote: '"',
        quoted: true,
        quoted_empty: true,
      });

      let csvContent = '';

      stringifier.on('readable', () => {
        let chunk;
        while ((chunk = stringifier.read()) !== null) {
          csvContent += chunk;
        }
      });

      stringifier.on('finish', () => {
        resolve(csvContent);
      });

      stringifier.on('error', (error) => {
        reject(error);
      });

      // Write data rows
      for (const row of data) {
        const csvRow = this.formatRowForCSV(row, headers);
        stringifier.write(csvRow);
      }

      stringifier.end();
    });
  }

  /**
   * Format a data row for CSV export
   */
  private formatRowForCSV(row: any, headers?: string[]): CSVRow {
    if (headers) {
      const formattedRow: CSVRow = {};
      headers.forEach((header) => {
        formattedRow[header] = this.formatValueForCSV(row[header]);
      });
      return formattedRow;
    }

    const formattedRow: CSVRow = {};
    for (const [key, value] of Object.entries(row)) {
      formattedRow[key] = this.formatValueForCSV(value);
    }
    return formattedRow;
  }

  /**
   * Format a value for CSV export
   */
  private formatValueForCSV(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }
}
