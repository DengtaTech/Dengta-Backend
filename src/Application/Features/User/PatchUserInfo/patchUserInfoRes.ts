export const patchUserInfoRes = {
  customize: async (): Promise<{
    message: string;
  }> => {
    return {
      message: 'User info updated successfully',
    };
  },
};
