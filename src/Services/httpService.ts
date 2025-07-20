import apiClient from "./apiClient";

class HttpService {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async fetchAllRecords() {
    const response = await apiClient.get(`/${this.tableName}`);
    return response.data.records;
  }

  async fetchRecord<string>(entity: string) {
    if (!entity) {
      alert("Please enter a valid id");
      return;
    }
    const response = await apiClient.get(`/${this.tableName}/${entity}`);
    return response.data.records;
  }

  async createRecords<string>(entity: string) {
    await apiClient.post(`/${this.tableName}`, {
      fields: entity,
    });
  }

  async updateRecord<string>(entity: string) {
    if (!entity.id) {
      alert("Please enter a valid id");
      return;
    }
    const { id, ...fieldsToUpdate } = entity;
    await apiClient.patch(`/${this.tableName}/${id}`, {
      fields: fieldsToUpdate.fields,
    });
  }

  async deleteRecord<string>(entity: string) {
    if (!entity) {
      alert("Please enter a valid id");
      return;
    }
    await apiClient.delete(`/${this.tableName}/${entity}`);
  }
}

export default HttpService;
