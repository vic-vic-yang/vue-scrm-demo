import Api from '../../index';
// import Api from '../../mock';

export default {
  index(params) {
    return Api.get('/document/v1/documents',
      {params}
    ).then(res => res.data);
  },
  type(params) {
    return Api.get('/document/v1/document-types',
      {params}
    ).then(res => res.data);
  },
  addType(params) {
    return Api.post('/document/v1/document-types', params, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.data);
  },
  editType(id, params) {
    return Api.put(`/document/v1/document-types/${id}`, params, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.data);
  },
  getType(id, params) {
    return Api.get(`/document/v1/document-types/${id}`, {
      params
    }).then(res => res.data);
  },
  getDoc(id, params) {
    return Api.get(`/document/v1/documents/${id}`, {
      params
    }).then(res => res.data);
  },
  getRecords(doc_id, params) {
    return Api.get(`/document/v1/document/${doc_id}/records`,
      {params}
    ).then(res => res.data);
  },
  deleteRecords(userDocId, id, params) {
    return Api.delete(`/document/v1/document/${userDocId}/records/${id}`,
      {params}
    ).then(res => res.data);
  },
  getRecordDetail(userDocId, id, params) {
    return Api.get(`/document/v1/document/${userDocId}/records/${id}`,
      {params}
    ).then(res => res.data);
  },
  getForms(params) {
    return Api.get(`/base/v1/form/forms/list`,
      {params}
    ).then(res => res.data);
  },
  getActivities(params) {
    return Api.get(`/document/v1/activities`,
      {params}
    ).then(res => res.data);
  },
  getActivity(id, params) {
    return Api.get(`/document/v1/activities/${id}`,
      {params}
    ).then(res => res.data);
  },
  getActivitySelect(params) {
    return Api.get(`/document/v1/activities/all`,
      {params}
    ).then(res => res.data);
  },
  addActivity(params) {
    return Api.post(`/document/v1/activities`, params, {
      headers: {'Content-Type': 'application/json'}
    }).then(res => res.data);
  },
  editActivity(id, params) {
    return Api.put(`/document/v1/activities/${id}`, params, {
      headers: {'Content-Type': 'application/json'}
    }).then(res => res.data);
  },
  saveRecord(userDocId, params) {
    return Api.post(`/document/v1/document/${userDocId}/records`, params, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.data);
  },
  editDocField(valueId, params) {
    return Api.put(`/document/v1/documents/${valueId}`, params, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.data);
  },
  addDocField(params) {
    return Api.post(`/document/v1/documents`, params, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.data);
  },
  getRequiredForm(params) {
    return Api.get(`/document/v1/document-types/required-forms`,
      {params}
    ).then(res => res.data);
  }
};

