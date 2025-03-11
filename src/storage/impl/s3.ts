import { env } from "@/lib/env";
import Logger from "@/lib/logger";
import { readableToBuffer } from "@/lib/utils/stream";
import * as Minio from "minio";
import internal, { Readable } from "stream";
import Storage from "../storage";

export default class S3Storage extends Storage {
  private client: Minio.Client;

  constructor() {
    super();
    this.client = new Minio.Client({
      endPoint: env.STORAGE_S3_ENDPOINT,
      port: env.STORAGE_S3_PORT,
      useSSL: env.STORAGE_S3_USE_SSL,
      accessKey: env.STORAGE_S3_ACCESS_KEY,
      secretKey: env.STORAGE_S3_SECRET_KEY,
    });

    this.ensureBucket(env.STORAGE_S3_BUCKET);
  }

  /**
   * Creates the bucket if it's missing
   *
   * @param bucket the name of the bucket
   */
  async ensureBucket(bucket: string) {
    if (!(await this.client.bucketExists(bucket))) {
      this.client.makeBucket(bucket);
    }
  }

  async saveFile(
    name: string,
    data: Buffer | Readable,
    size?: number
  ): Promise<boolean> {
    try {
      let stream: Readable;
      let dataSize: number;

      if (Buffer.isBuffer(data)) {
        stream = Readable.from(data);
        dataSize = data.length;
      } else {
        if (size === undefined) {
          throw new Error("Size must be provided when using a stream");
        }
        stream = data;
        dataSize = size;
      }

      await this.client.putObject(
        env.STORAGE_S3_BUCKET,
        name,
        stream,
        dataSize
      );
      return true;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }

  async getFile(name: string): Promise<Buffer | null> {
    try {
      const stream = await this.client.getObject(env.STORAGE_S3_BUCKET, name);
      return readableToBuffer(stream);
    } catch (err) {
      Logger.error(err);
      return null;
    }
  }

  async getFileStream(name: string): Promise<internal.Readable | null> {
    try {
      return await this.client.getObject(env.STORAGE_S3_BUCKET, name);
    } catch (err) {
      Logger.error(err);
      return null;
    }
  }

  async deleteFile(name: string): Promise<boolean> {
    try {
      await this.client.removeObject(env.STORAGE_S3_BUCKET, name);
      return true;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }

  async getFileStreamRange(
    name: string,
    start: number,
    end: number
  ): Promise<internal.Readable | null> {
    try {
      return await this.client.getPartialObject(
        env.STORAGE_S3_BUCKET,
        name,
        start,
        end - start + 1
      );
    } catch (err) {
      Logger.error(err);
      return null;
    }
  }

  async renameFile(oldName: string, newName: string): Promise<boolean> {
    console.log({
      oldName,
      newName,
    });
    try {
      await this.client.copyObject(
        env.STORAGE_S3_BUCKET,
        newName,
        `/${env.STORAGE_S3_BUCKET}/${oldName}`
      );
      await this.deleteFile(oldName);
      return true;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}
