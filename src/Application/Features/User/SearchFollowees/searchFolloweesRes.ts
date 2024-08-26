import { SearchFollowees } from './Types/api.js';

export const searchFolloweesRes = {
  customize: async (
    result: SearchFollowees.ISearchFolloweesDto[],
  ): Promise<SearchFollowees.ISearchFolloweesRes> => {
    const response: SearchFollowees.ISearchFolloweesRes = {
      data: result.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        hashtags: user.mUserProfileHashTag.map(
          (tag) => tag.profileHashTag.content,
        ),
        lifeRole: user.lifeRole,
        selfIntro: user.selfIntro,
      })),
    };
    return response;
  },
};
