import {createStore} from '../wtfkit/create-store.js';
import * as zod from 'zod';

export const completionStore = createStore({
  initialState: `idle`,
  initialValue: {},
  valueSchemaMap: {
    idle: zod.object({}),
    sending: zod.object({id: zod.string().uuid()}),
    receiving: zod.object({
      id: zod.string().uuid(),
      contentDelta: zod.string(),
    }),
  },
  transitionsMap: {
    idle: {send: `sending`},
    sending: {cancel: `idle`, receive: `receiving`},
    receiving: {cancel: `idle`, receive: `receiving`},
  },
});
