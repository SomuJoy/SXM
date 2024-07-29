import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export const mockOneStepNOUVRoutesWithVehicle = () => mockRoutesFromHAR(require('../fixtures/nouv-success-with-vehicle.har.json'));
export const mockOneStepNOUVRoutesNoVehicle = () => mockRoutesFromHAR(require('../fixtures/nouv-success-no-vehicle.har.json'));

export const mockNOUVRtp = () => mockRoutesFromHAR(require('../fixtures/nouv-rtp-valid.har.json'));
