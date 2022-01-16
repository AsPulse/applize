#!/usr/bin/env node
import {
  colors,
  confirmYesNo,
  decorate,
} from '../util/console/consoleCommunicater';
import { FileCreator } from './fileio/creator';

new FileCreator((path) =>
  confirmYesNo([
    decorate(colors.green),
    'File ',
    path,
    ' is already exists. Override?',
  ])
);
