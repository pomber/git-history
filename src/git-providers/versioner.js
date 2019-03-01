/* eslint-disable import/no-webpack-loader-syntax */
import worker from "workerize-loader!./versioner.worker";
let versioner = worker();

export default versioner;
