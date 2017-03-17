"use strict";
import angular from "angular";

function FileService($http, CoreService, Setting, gettextCatalog) {
  this.delete = (id, successCb, cancelCb) => {
    CoreService.confirm(err => {
      CoreService.toastError(
        gettextCatalog.getString("Error deleting file"),
        gettextCatalog.getString(`Your file is not deleted! ${err}`)
      );
      cancelCb();
    });
  };
}

angular
  .module("com.module.files.services.file", [])
  .service("FileService", FileService);
