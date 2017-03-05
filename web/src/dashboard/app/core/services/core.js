"use strict";
import angular from "angular";

function CoreService(SweetAlert, ngToast) {
  this.alert = (title, text) => {
    SweetAlert.swal(title, text);
  };

  this.alertSuccess = (title, text) => {
    SweetAlert.swal(title, text, "success");
  };

  this.alertError = (title, text) => {
    SweetAlert.swal(title, text, "error");
  };

  this.alertWarning = (title, text) => {
    SweetAlert.swal(title, text, "warning");
  };

  this.alertInfo = (title, text) => {
    SweetAlert.swal(title, text, "info");
  };

  this.confirm = (title, text, successCb, cancelCb) => {
    const config = {
      title: title,
      text: text,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55"
    };
    this._swal(config, successCb, cancelCb);
  };

  this._swal = (config, successCb, cancelCb) => {
    SweetAlert.swal(config, confirmed => {
      if (confirmed) {
        successCb();
      } else {
        cancelCb();
      }
    });
  };

  this.toastSuccess = (title, text) => ngToast.create({
    className: "success",
    content: `<b>${title}</b><br />${text}`
  });

  this.toastError = (title, text) => ngToast.create({
    className: "danger",
    content: `<b>${title}</b><br />${text}`
  });

  this.toastWarning = (title, text) => ngToast.create({
    className: "warning",
    content: `<b>${title}</b><br />${text}`
  });

  this.toastInfo = (title, text) => ngToast.create({
    className: "info",
    content: `<b>${title}</b><br />${text}`
  });
}

angular
  .module("com.module.core.services.core", [])
  .service("CoreService", CoreService);
