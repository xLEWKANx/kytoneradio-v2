"use strict";
import angular from "angular";

import "./services/core";
import "./services/meta";

const NAME = "com.module.core.services";
const MODULES = [`${NAME}.core`, `${NAME}.meta`];

angular.module(NAME, MODULES);
