// src/assets/importImages.js
const requireModule = require.context('../../../../assets/sunseen/env/data', false, /\.png$/);

requireModule.keys().forEach(requireModule);
