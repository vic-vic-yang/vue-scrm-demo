import Api from './index';
import { Message } from 'element-ui';

const Upload = (url = '/v1/fileUpload/file-upload/upload', file, name = 'file', progressFn) => {
  if (!file) {
    Message({
      message: '上传文件不能为空',
      type: 'error',
      duration: 3000
    });
    return Promise.reject(false);
  }
  const uploadFormData = new FormData();
  uploadFormData.append(name, file);
  return Api.post(url, uploadFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
    onUploadProgress(ev) {
      typeof progressFn === 'function' && progressFn(ev);
    }
  })
    .then(res => {
      if (res.code === 200 && res.data && res.data.url) {
        Message({
          message: '上传成功',
          type: 'success',
          duration: 3000
        });
        return res.data;
      }
      Message({
        message: res.message || '上传失败',
        type: 'error',
        duration: 3000
      });
      return Promise.reject(res);
    });
};

export default {
  img(file, name = 'file', progressFn) {
    return Upload('/v1/fileUpload/file-upload/upload', file, name, progressFn);
  },
  audio(file, name = 'file', progressFn) {
    return Upload('/v1/fileUpload/file-upload/file-upload', file, name, progressFn);
  },
  webUpload() {
    return Api.get('/base/v1/fileUpload/file-upload/web-upload');
  },
  img_url(fileUrl) {
    const uploadFormData = {
      url: fileUrl
    };
    return Api.post('/v1/fileUpload/file-upload/upload-url', uploadFormData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
  }
};
