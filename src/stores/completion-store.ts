import {createStore} from 'state-guard';

export const completionStore = createStore({
  initialState: `inactive`,
  initialValue: undefined,
  transformerMap: {
    inactive: () => undefined,
    sending: (value: {readonly id: string}) => value,
    receiving: (value: {readonly id: string; readonly contentDelta: string}) =>
      value,
  },
  transitionsMap: {
    inactive: {send: `sending`},
    sending: {cancel: `inactive`, receive: `receiving`},
    receiving: {cancel: `inactive`, receive: `receiving`},
  },
});
