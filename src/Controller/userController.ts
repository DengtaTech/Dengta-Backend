import { signUpHandler } from '../Application/Features/User/SignUp/signUpHandler.js';
import { Request, Response } from 'express';
import {
  InputEmptyError,
  NoTokenError,
  InvalidInputError,
  SameOperatingTargetingUserError,
} from '../Errors/errors.js';
import { Signup } from '../Application/Features/User/SignUp/Types/api.js';
import { signInHandler } from '../Application/Features/User/SignIn/signInHandler.js';
import { uploadAvatarHandler } from '../Application/Features/User/UploadAvatar/uploadAvatarHandler.js';
import { getUserInfoHandler } from '../Application/Features/User/GetUserInfo/getUserInfoHandler.js';
import { PatchUserInfo } from '../Application/Features/User/PatchUserInfo/Types/api.js';
import { patchUserInfoHandler } from '../Application/Features/User/PatchUserInfo/patchUserInfoHandler.js';
import { validatePatchUserInfoReqBody } from '../Application/Features/User/PatchUserInfo/Types/patchUserInfoDto.js';
import { followHandler } from '../Application/Features/User/Follow/followHandler.js';
import { unFollowHandler } from '../Application/Features/User/UnFollow/unFollowHandler.js';
import { getFootprintsHandler } from '../Application/Features/User/GetFootprints/getFootprints.js';
import { validateSignUpReqBodyReqBody } from '../Application/Features/User/SignUp/Types/signupDto.js';
import { userService } from '../Infrastructure/Service/userService.js';
import { searchFolloweesHandler } from '../Application/Features/User/SearchFollowees/searchFolloweesHandler.js';
import { editCardLinkHandler } from '../Application/Features/User/EditCardLink/editCardLinkHandler.js';
import { getCardUrlHandler } from '../Application/Features/User/GetCardLink/getCardUrlHandler.js';
import { getCardInfoHandler } from '../Application/Features/User/GetCardInfo/getCardInfoHandler.js';
import { getPublicFootprintsHandler } from '../Application/Features/User/GetPublicFootprints/getPublicFootprintsHandler.js';

export const userController = {
  signUp: async (req: Request, res: Response): Promise<void> => {
    const validationErrors = await validateSignUpReqBodyReqBody(req.body);
    if (validationErrors.length > 0) {
      throw new InvalidInputError(validationErrors.join(', '));
    }

    const response = await signUpHandler.handle(req.body as Signup.ISignUpReq);
    res.status(200).json(response);
  },
  signIn: async (req: Request, res: Response): Promise<void> => {
    const { provider, email, password } = req.body;
    if (!email || !password) {
      throw new InputEmptyError();
    }
    const response = await signInHandler.handle(email, password, provider);
    res.status(200).json(response);
  },

  getUserInfo: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const response = await getUserInfoHandler.handle(userId);
    res.status(200).json(response);
  },

  uploadAvatar: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }

    const { id: userId } = req.decodedToken;
    const file = req.file;

    if (!file) {
      res.status(400).send({ message: 'Please upload an image file.' });
      return;
    }
    const response = await uploadAvatarHandler.handle(userId, file);
    res.status(200).json(response);
  },

  patchUserInfo: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const validationErrors = await validatePatchUserInfoReqBody(req.body);
    if (validationErrors.length > 0) {
      throw new InvalidInputError(validationErrors.join(', '));
    }

    const response = await patchUserInfoHandler.handle(
      userId,
      req.body as PatchUserInfo.PatchUserInfoReqBody,
    );
    res.status(200).json(response);
  },
  getOthersInfo: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }

    const { userId: queryUserId } = req.params;

    const response = await getUserInfoHandler.handle(queryUserId);
    res.status(200).json(response);
  },
  follow: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: followerId } = req.decodedToken;
    const { followeeId } = req.params;

    if (!followeeId) {
      throw new InvalidInputError('followeeId is inlegal');
    }
    if (followerId === followeeId) {
      throw new SameOperatingTargetingUserError();
    }

    const response = await followHandler.handle({ followerId, followeeId });
    res.status(200).json(response);
  },
  unFollow: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: followerId } = req.decodedToken;
    const { followeeId } = req.params;

    if (!followeeId) {
      throw new InvalidInputError('followeeId is illegal');
    }
    if (followerId === followeeId) {
      throw new SameOperatingTargetingUserError();
    }

    const response = await unFollowHandler.handle({
      followerId,
      followeeId,
    });
    res.status(200).json(response);
  },
  getFootprints: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const queryUserId = req.params.userId;
    const isUserIdExists = await userService.isUserIdExists(queryUserId);
    if (!isUserIdExists) {
      throw new InvalidInputError('No such user');
    }

    const page = parseInt(req.query.page as string) || 1;
    if (page <= 0) {
      throw new InvalidInputError('page must be a positive integer');
    }

    const isPublicRequest = queryUserId !== userId;
    const footprints = await getFootprintsHandler.handle(
      queryUserId,
      isPublicRequest,
      page,
    );

    res.status(200).json(footprints);
  },
  searchFollowees: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const keywords = req.query.keywords;
    if (typeof keywords !== 'string' && typeof keywords !== 'undefined') {
      throw new InvalidInputError('keywords must be a string');
    }
    const response = await searchFolloweesHandler.handle(userId, keywords);
    res.status(200).json(response);
  },
  editLink: async (req: Request, res: Response) => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const { urlContext, footprintId } = req.body;
    if (!urlContext) {
      throw new InvalidInputError('urlContext should not be null');
    }
    if (!footprintId) {
      throw new InvalidInputError('footprintId should not be null');
    }
    const response = await editCardLinkHandler.handle(
      userId,
      urlContext,
      footprintId,
    );
    res.status(200).json(response);
  },
  getCardUrl: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const response = await getCardUrlHandler.handle(userId);
    res.status(200).json(response);
  },
  getCardInfo: async (req: Request, res: Response): Promise<void> => {
    const { cardUrl } = req.params;

    const response = await getCardInfoHandler.handle(cardUrl);
    res.status(200).json(response);
  },
  getPublicFootprints: async (req: Request, res: Response): Promise<void> => {
    const { cardUrl } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    if (page <= 0) {
      throw new InvalidInputError('page must be a positive integer');
    }
    const response = await getPublicFootprintsHandler.handle(cardUrl, page);
    res.status(200).json(response);
  },
};
