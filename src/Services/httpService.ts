import apiClient from "./apiClient";

class HtttpService {
  async fetchRecords() {
    const response = await apiClient.get();
    console.log(response);
    return response.data.records;
  }

  async createRecords(record) {
    await apiClient.post(`/`, {
      fields: record,
    });
  }

  async updateRecord(record) {
    console.log("update", record);
    if (!record.id) {
      alert("Please enter a valid id");
      return;
    }
    const { id, ...fieldsToUpdate } = record;
    await apiClient.patch(`/${id}`, {
      fields: fieldsToUpdate.fields,
    });
  }

  async deleteRecord(record) {
    if (!record) {
      alert("Please enter a valid id");
      return;
    }
    await apiClient.delete(`/${record}`);
    console.log("Delete success");
  }
}

export default HtttpService;
