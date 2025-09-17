import apiClient from "./apiClient";

export default class HttpService {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async fetchAllRecords() {
    const response = await apiClient.get(`/${this.tableName}`);
    return response.data.records;
  }

  async fetchRecord(entity: string) {
    if (!entity) {
      alert("Please enter a valid id");
      return;
    }
    const response = await apiClient.get(`/${this.tableName}/${entity}`);
    return response.data.records;
  }

  async createRecords<T extends object>(entity: T) {
    await apiClient.post(`/${this.tableName}`, {
      fields: entity,
    });
  }

  async updateRecord<T extends { id: string; fields: object }>(entity: T) {
    if (!entity.id) {
      alert("Please enter a valid id");
      return;
    }
    await apiClient.patch(`/${this.tableName}/${entity.id}`, {
      fields: entity.fields,
    });
  }

  async deleteRecord(entity: string) {
    if (!entity) {
      alert("Please enter a valid id");
      return;
    }
    await apiClient.delete(`/${this.tableName}/${entity}`);
  }
}


