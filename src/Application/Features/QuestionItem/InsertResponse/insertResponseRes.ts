import { InsertResponse } from './Types/api.js';

export const insertResponseRes = {
  customize: (): InsertResponse.TRes => {
    return {
      data: {
        message: 'Response inserted successfully',
      },
    };
  },
};
