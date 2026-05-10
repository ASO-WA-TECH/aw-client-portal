import apiClient from "./apiClient";

export interface AirtableRecord<T = Record<string, unknown>> {
  id: string;
  createdTime: string;
  fields: T;
}

export interface AirtableListResponse<T> {
  records: AirtableRecord<T>[];
}

export default class HttpService<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async fetchAllRecords(): Promise<AirtableRecord<T>[]> {
    const response = await apiClient.get<AirtableListResponse<T>>(
      `/${this.tableName}`,
    );
    return response.data.records;
  }

  async fetchRecord(id: string): Promise<AirtableRecord<T>> {
    if (!id) {
      throw new Error("Invalid ID");
    }

    const response = await apiClient.get<AirtableRecord<T>>(
      `/${this.tableName}/${id}`,
    );
    return response.data;
  }

  async createRecords(entity: T): Promise<AirtableRecord<T>> {
    const response = await apiClient.post<AirtableRecord<T>>(
      `/${this.tableName}`,
      {
        fields: entity,
      },
    );

    return response.data;
  }

  async updateRecord(entity: {
    id: string;
    fields: Partial<T>;
  }): Promise<AirtableRecord<T>> {
    if (!entity.id) {
      throw new Error("Invalid ID");
    }

    const response = await apiClient.patch<AirtableRecord<T>>(
      `/${this.tableName}/${entity.id}`,
      {
        fields: entity.fields,
      },
    );

    return response.data;
  }

  async deleteRecord(id: string): Promise<void> {
    if (!id) {
      throw new Error("Invalid ID");
    }

    await apiClient.delete(`/${this.tableName}/${id}`);
  }
}
