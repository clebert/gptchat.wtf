import {createStore} from 'state-guard';
import {z} from 'zod';

export const completionStore = createStore({
  initialState: `inactive`,
  initialValue: undefined,
  valueSchemaMap: {
    inactive: z.void(),
    sending: z.object({id: z.string().uuid()}).strict(),
    receiving: z
      .object({id: z.string().uuid(), contentDelta: z.string()})
      .strict(),
  },
  transitionsMap: {
    inactive: {send: `sending`},
    sending: {cancel: `inactive`, receive: `receiving`},
    receiving: {cancel: `inactive`, receive: `receiving`},
  },
});
