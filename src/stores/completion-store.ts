import {createStore} from 'state-guard';
import * as z from 'zod';

export const completionStore = createStore({
  initialState: `idle`,
  initialValue: undefined,
  valueSchemaMap: {
    idle: z.void(),
    sending: z.object({id: z.string().uuid()}),
    receiving: z.object({id: z.string().uuid(), contentDelta: z.string()}),
  },
  transitionsMap: {
    idle: {send: `sending`},
    sending: {cancel: `idle`, receive: `receiving`},
    receiving: {cancel: `idle`, receive: `receiving`},
  },
});
