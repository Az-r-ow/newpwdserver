module.exports = class Locals {
  constructor(_title = 'hello', _session = null, _data = null, _message = null, _sort_type = null, _upload_error = null, _error = null){
    this.title = _title,
    this.session = _session,
    this.data = _data,
    this.message = _message,
    this.sort_type = _sort_type,
    this.upload_error = _upload_error,
    this.error = _error
  }

  setTitle(_title){
    this.title = _title;
    return this;
  }

  setSession(_session){
    this.session = _session;
    return this;
  }

  setData(_data){
    this.data = _data;
    return this;
  }

  setMessage(_message){
    this.message = _message;
    return this;
  }

  setSort_type(_sort_type){
    this.sort_type = _sort_type;
    return this;
  }

  setUpload_error(_upload_error){
    this.upload_error = _upload_error;
    return this;
  }

  setError(_error){
    this.error = _error;
    return this;
  }

}
